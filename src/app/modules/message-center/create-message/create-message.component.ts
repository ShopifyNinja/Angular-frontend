import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
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

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateMessageComponent implements OnInit {
  form = new FormGroup({
    subject: new FormControl(''),
    body: new FormControl('', {
      updateOn: 'change'
    }),
    files: new FormControl([]),
  });

  submitting = false;
  @ViewChild(AttachFileComponent) attachFileComponent: AttachFileComponent;
  public attachments: string[] = [];

  constructor(
    private router: Router,
    public messagesAppService: MessagesAppService,
    private toastr: ToastrService,
    private loadingBarService: LoadingBarService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.messagesAppService.getSubjects();
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitting = true;
      const message: Message = {
        subject: this.form.value.subject,
        body: this.form.value.body,
        attachments: this.attachFileComponent.attachments,
      };

      this.loadingBarService.setLoading(true);
      this.messagesAppService
        .addMessage(message)
        .then((success) => {
          // TODO: fix
          if (true) {
            this.toastr.success(
              '',
              'Mail Sent.'
            );
            this.messagesAppService.getMessages('sent');
            this.activeModal.dismiss('Cross click');
            this.submitting = false;
          } else {
            this.toastr.error(
              '',
              'Your message could not be delivered'
            );
            this.submitting = false;
          }
          this.loadingBarService.setLoading(false);
        })
        .catch((error) => {
          this.toastr.success('', 'Mail Sent.');
          this.messagesAppService.getMessages('sent');
          this.submitting = false;
          this.loadingBarService.setLoading(false);
          this.activeModal.dismiss('Cross click');
        });
    }
  }

  onAttachmentsChanged() {
    this.attachments = this.attachFileComponent.attachments;
  }

  removeFile(index) {
    this.attachFileComponent.removeFile(index);
  }

  onClose(){
    const message: Message = {
      subject: this.form.value.subject,
      body: this.form.value.body,
      attachments: this.attachFileComponent.attachments,
    };

    if(this.form.value.subject){
      this.loadingBarService.setLoading(true);
      this.messagesAppService
        .saveDraftMessage(message)
        .then((success) => {
          if (success) {
            this.toastr.success('', 'Draft Saved.');
            this.messagesAppService.getMessages('draft');
            this.submitting = false;
          } else {
            this.toastr.error('','Draft could not be saved');
            this.submitting = false;
          }
          this.loadingBarService.setLoading(false);
        })
        .catch((error) => {
          console.log('caught error');
          this.toastr.error('','Draft could not be saved');
          this.submitting = false;
        });

      this.messagesAppService.getMessages('draft');
    }
    this.activeModal.dismiss('Cross click');
  }
}
