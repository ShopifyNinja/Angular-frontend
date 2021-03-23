import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  throttleTime,
  debounceTime
} from 'rxjs/operators';

import { LoadingBarService } from '../../shared/services/loading-bar.service';
import { MessagesAppService } from '../../shared/services/messages-app.service';
import { CreateMessageComponent } from '../create-message/create-message.component';
import { MessagesFilters } from '../../shared/interfaces/messages';
import { SearchComponent } from '../search/search.component';
import {
  InboxMessagesService,
  SentMessagesService,
  DeletedMessagesService,
  DraftMessagesService
} from '../services/messages-module.service';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  backdrop = false;
  curSelectedTab = 0;
  showFilter = false;
  showSortPanel = false;
  curMessagesService;
  selectAllToggle = false;

  queryControl: FormControl = new FormControl();
  queryCtrlSub: Subscription;
  public isSearchVisible = false;

  type: string;
  sortFilters: MessagesFilters = {
    sortBy: 'date',
    sortDirection: 'descending'
  };

  constructor(
    public messagesAppService: MessagesAppService,
    public inboxMessagesService: InboxMessagesService,
    public sentMessagesService: SentMessagesService,
    public deletedMessagesService: DeletedMessagesService,
    public draftMessagesService: DraftMessagesService,
    protected toastr: ToastrService,
    protected loadingBarService: LoadingBarService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
  ) {
    this.messagesAppService.getMessages('inbox');
    this.messagesAppService.getMessages('sent');
    this.messagesAppService.getMessages('draft');
    this.messagesAppService.getMessages('deleted');

    this.curMessagesService = this.inboxMessagesService;
  }
  ngOnInit(): void {
    window.addEventListener('wheel', this.scroll, true);
    this.queryCtrlSub = this.queryControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(e => {
      this.messagesAppService.getMessages(this.type, { query: e, page: 1 });
    });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  tabChanged( tabChangeEvent: MatTabChangeEvent ): void {
    this.curSelectedTab = tabChangeEvent.index;
    if(this.curSelectedTab === 0){
      this.type = 'inbox';
      this.curMessagesService = this.inboxMessagesService;
    }else if(this.curSelectedTab === 1){
      this.type = 'draft';
      this.curMessagesService = this.draftMessagesService;
    }else if(this.curSelectedTab === 2){
      this.type = 'sent';
      this.curMessagesService = this.sentMessagesService;
    }else if(this.curSelectedTab === 3){
      this.type = 'deleted';
      this.curMessagesService = this.deletedMessagesService;
    }
  }

  toggleFilters(): void {
    this.showFilter = !this.showFilter;
  }

  toggleBackdrop(): void {
    this.backdrop = !this.backdrop;
  }

  hideSortPanel(): void {
    this.backdrop = false;
    this.showSortPanel = false;
  }

  toggleSelectAll(): void {
    this.curMessagesService.selectAll();
    this.selectAllToggle = !this.selectAllToggle;
  }

  delete(): void{
    this.curMessagesService.deleteSelected().then(success => {
      if (success) {
        this.toastr.success('', 'Your message(s) have been moved to deleted');
      } else {
        this.toastr.error('', 'Your message(s) could not be deleted');
      }
    });
  }

  newMessageModal() {
    const modalRef = this.modalService.open(CreateMessageComponent, { windowClass: 'create-message-modal' });
  }

  setSortBy(sortBy: 'date' | 'from' | 'subject' | 'attachments' | 'unread'){
    this.hideSortPanel();
    this.sortFilters.sortBy = sortBy;
    this.messagesAppService.getMessages(this.type, this.sortFilters);
  }

  toggleSortDirection(){
    this.sortFilters.sortDirection = this.sortFilters.sortDirection === 'descending'?'ascending':'descending';
    this.messagesAppService.getMessages(this.type, this.sortFilters);
  }

  onSearchFocus() {
    const modalRef = this.modalService.open(SearchComponent, { windowClass: 'create-message-modal' });
    modalRef.componentInstance.messagesService = this.curMessagesService;
    modalRef.result.then((result) => {
      this.queryControl.setValue(result);
    });
  }

  scroll = (event: any): void =>  {
    const scrollingUp = event.deltaY < 0;
    this.isSearchVisible = scrollingUp;
    this.cdr.detectChanges();
  };

}
