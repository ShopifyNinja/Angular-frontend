import { Component, Input, OnInit, HostBinding, ChangeDetectorRef  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, fromEvent } from 'rxjs';

import { Message, MessagesFilters } from 'src/app/modules/shared/interfaces/messages';
import { LoadingBarService } from 'src/app/modules/shared/services/loading-bar.service';
import { MessagesAppService } from 'src/app/modules/shared/services/messages-app.service';
import { SearchComponent } from '../../search/search.component';
import { BaseMessagesService } from '../../services/messages-module.service';

enum Direction {
  Up = 'Up',
  Down = 'Down'
}

/**
 * BaseSectionComponent is the content of each tab in the message center: inbox | sent | deleted | draft
 * App level main service: MessagesAppService
 * Module level service: MessagesModuleService as MessagesService
 * @param type inbox | sent | deleted | draft
 */
@Component({
  selector: 'app-base-section',
  templateUrl: './base-section.component.html',
  styleUrls: ['./base-section.component.scss']
})
export class BaseSectionComponent implements OnInit {
  @Input() type: string; // inbox | sent | deleted | draft
  @Input() showSelect: boolean;
  @Input() messagesService: BaseMessagesService;

  selectedMessagesIds: string[] = [];
  deleteEnabled = false;
  deleting = false;
  initialLoad = false;
  sortFilters: MessagesFilters = {
    sortBy: 'date',
    sortDirection: 'descending'
  };

  messages$: Observable<Message[]>;
  selectedMessages$: Observable<Message[]>;

  constructor(
    /* public messagesService: MessagesService, */
    public messagesAppService: MessagesAppService,
    protected toastr: ToastrService,
    protected loadingBarService: LoadingBarService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    // Get te observables based on the type
    this.messages$ = this.messagesAppService.getMessagesObs(this.type);
    this.selectedMessages$ = this.messagesService.selectedMessages$;
    // Catch when messages are selected, store as ids
    this.selectedMessages$.subscribe(selectedMessages => {
      this.selectedMessagesIds = selectedMessages.map(m => m.messageId);
      this.deleteEnabled = this.selectedMessagesIds.length > 0;
    });

    this.messages$.subscribe((m) => {
      if (m.length > 0) { this.initialLoad = true; }
    });
  }

  ngAfterViewChecked(): void {
    // let inboxItems = document.getElementsByTagName('app-inbox-item');
    // if(inboxItems.length > 0){
    //   inboxItems[0].scrollIntoView();
    //   window.scrollBy(0, 1);
    // }
  }

  onSelectAll(selected) {
    this.messagesService.selectAll(selected);
  }

  isSelected(id) {
    return this.selectedMessagesIds.indexOf(id) >= 0;
  }

  onSelect(data: any) {
    console.log(data);
    this.messagesService.selectMessage(data.id, data.selected);
  }

  onDelete() {
    this.loadingBarService.setLoading(true);
    this.messagesService.deleteSelected().then(success => {
      if (success) {
        this.toastr.success('Messages deletion', 'Your message(s) have been moved to deleted');
      } else {
        this.toastr.error('Messages deletion', 'Your message(s) could not be deleted');
      }
      this.deleting = false;
      this.loadingBarService.setLoading(false);
    });
  }

  onRestore() {
    this.loadingBarService.setLoading(true);
    this.messagesService.restoreSelected().then(success => {
      if (success) {
        this.toastr.success('Messages restore', 'Your message(s) have been restored');
      } else {
        this.toastr.error('Messages restore', 'Your message(s) could not be restored');
      }
      this.deleting = false;
      this.loadingBarService.setLoading(false);
    });
  }

  onSortFiltersChange({ sortBy, sortDirection }) {
    this.sortFilters = { sortBy, sortDirection };
    this.messagesAppService.getMessages(this.type, this.sortFilters);
  }

  hasPrevPage() {
    return this.messagesAppService.hasPrevPage(this.type);
  }

  onPrevPage(): void {
    if (this.messagesAppService.hasPrevPage(this.type)) {
      this.messagesAppService.prevPage(this.type);
    }
  }

  hasNextPage() {
    return this.messagesAppService.hasNextPage(this.type);
  }

  onNextPage(): void {
    if (this.messagesAppService.hasNextPage(this.type)) {
      this.messagesAppService.nextPage(this.type);
    }
  }
}
