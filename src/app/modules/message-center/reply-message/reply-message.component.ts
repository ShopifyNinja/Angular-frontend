import { Component, ElementRef, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MessagesAppService } from '../../shared/services/messages-app.service';
import { LoadingBarService } from '../../shared/services/loading-bar.service';
import { Message } from '../../shared/interfaces/messages';
import { AttachFileComponent } from '../attach-file/attach-file.component';
import { NgxFilesizeModule } from 'ngx-filesize';

@Component({
  selector: 'app-reply-message',
  templateUrl: './reply-message.component.html',
  styleUrls: ['./reply-message.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReplyMessageComponent implements OnInit {
  @Input() message;
  parentMessageId;

  form: FormGroup;

  submitting = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild(AttachFileComponent) attachFileComponent:AttachFileComponent;
  public attachments: string[] = [];

  constructor(
    private router: Router,
    public messagesAppService: MessagesAppService,
    private toastr: ToastrService,
    private loadingBarService: LoadingBarService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      subject: new FormControl(''),
      body: new FormControl(''),
      files: new FormControl([]),
    });
    this.parentMessageId = this.message.id;
    console.log(this.message);
    // this.messagesAppService.getSubjects();
  }

  get f() {
    return '';
    //return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitting = true;
      const message: Message = {
        subject: 'Re: ' + this.message.subject,
        body: this.form.value.body,
        attachments: this.attachments
      };
      this.loadingBarService.setLoading(true);

      this.messagesAppService
        .replyMessage(this.parentMessageId, message)
        .then(success => {
          if (success) {
            this.toastr.success('', 'Your reply has been submitted');
            //this.router.navigate(['/message-center/inbox']);
            this.messagesAppService.getMessages('inbox');
            this.messagesAppService.getMessages('sent');
            this.messagesAppService.getMessages('draft');
            this.messagesAppService.getMessages('deleted');
            this.activeModal.dismiss('Cross click');
            this.submitting = false;
          } else {
            this.toastr.error('', 'Your message could not be delivered');
            this.submitting = false;
          }
          this.loadingBarService.setLoading(false);
        });
    }
  }

  onAttachmentsChanged() {
    this.attachments = this.attachFileComponent.attachments;
    console.log(this.attachments);
  }

  onFileChange(e) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < e.target.files.length; i++) {
      this.attachments.push(e.target.files[i]);
    }
  }

  removeFile(index){
    this.attachFileComponent.removeFile(index);
  }
}
