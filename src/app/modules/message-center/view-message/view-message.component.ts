import { Component, ElementRef, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MessagesAppService } from '../../shared/services/messages-app.service';
import { LoadingBarService } from '../../shared/services/loading-bar.service';
import { Message } from '../../shared/interfaces/messages';
import { ReplyMessageComponent } from '../reply-message/reply-message.component';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.component.html',
  styleUrls: ['./view-message.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewMessageComponent implements OnInit {
  @Input() message;

  form: FormGroup;
  attachments: string[] = [];
  submitting = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private router: Router,
    public messagesAppService: MessagesAppService,
    private toastr: ToastrService,
    private loadingBarService: LoadingBarService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      subject: new FormControl(''),
      body: new FormControl(''),
      files: new FormControl([]),
    });
    this.messagesAppService.getMessage(this.message.id, this.message.folder.toLowerCase())
      .subscribe(u => {
        this.message = u;
        this.message.parentMessages = this.message.parentMessages.reverse();
        // update message box for read/unread states
        this.messagesAppService.getMessages(this.message.folder.toLowerCase());
      });
  }

  get f() {
    return '';
    //return this.form.controls;
  }

  onSubmit(): void {
  }

  onFileChange(e) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < e.target.files.length; i++) {
      this.attachments.push(e.target.files[i]);
    }
  }

  openReplyMessageModal(){
    const modalRef = this.modalService.open(ReplyMessageComponent, { windowClass: 'reply-message-modal' });
    modalRef.componentInstance.message = this.message;
    this.activeModal.dismiss('Cross click');
  }

  onDeleteClicked(){
    let folder = this.message.folder.toLowerCase();
    this.messagesAppService.deleteMessages([this.message.id], folder)
      .then(m => this.toastr.success('', 'Message Deleted.'))
      .catch(e => this.toastr.error('Message Deletion Error', e));
    this.messagesAppService.getMessages(folder);
    this.activeModal.dismiss('Cross click');
  }

  onClose(): void {
    this.activeModal.dismiss('Cross click')
  }
}
