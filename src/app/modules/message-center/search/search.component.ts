import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxFilesizeModule } from 'ngx-filesize';

import { MessagesAppService } from '../../shared/services/messages-app.service';
import { LoadingBarService } from '../../shared/services/loading-bar.service';
import { Message } from '../../shared/interfaces/messages';
import { AttachFileComponent } from '../attach-file/attach-file.component';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BaseMessagesService } from '../services/messages-module.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent implements OnInit {
  form: FormGroup;

  submitting = false;
  @ViewChild(AttachFileComponent) attachFileComponent: AttachFileComponent;
  public attachments: string[] = [];

  queryControl: FormControl = new FormControl();
  queryCtrlSub: Subscription;

  messagesService: BaseMessagesService;

  suggestions: any[] = [];

  @Output() queryChange = new EventEmitter<string>();

  constructor(
    public messagesAppService: MessagesAppService,
    public activeModal: NgbActiveModal,
    protected loadingBarService: LoadingBarService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      query: new FormControl(''),
    });

    this.queryCtrlSub = this.form.controls.query.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(e => {
      this.loadingBarService.setLoading(true);
      this.messagesService.searchSuggestions(this.form.value.query).then(s => {
        this.suggestions = s;
        this.loadingBarService.setLoading(false);
      });
    });
  }

  get f() {
    return this.form.controls;
  }
}
