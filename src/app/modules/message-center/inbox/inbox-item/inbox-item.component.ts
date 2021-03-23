import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ViewMessageComponent } from '../../view-message/view-message.component';
import { DateOrTimePipe } from 'src/app/core/filters/date.filter';

@Component({
  selector: 'app-inbox-item',
  templateUrl: './inbox-item.component.html',
  styleUrls: ['./inbox-item.component.scss'],

})
export class InboxItemComponent implements OnInit {

  @Input() message: any;
  @Input() selected: boolean;
  @Input() showSelect: boolean;

  @Output() messageSelect = new EventEmitter<any>();

  formattedDate: string;

  constructor(
    private modalService: NgbModal,
  ) { }

  formatAMPM(date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  formatMonthDay(date): string {
    const month = date.toLocaleString('default', { month: 'short' });
    return month + ' ' + date.getDate();
  }

  ngOnInit(): void {
    const date = new Date(this.message.createdOn);
    const today = new Date();
    if(date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear()
    ){
      this.formattedDate = this.formatAMPM(date);
    }else{
      this.formattedDate = this.formatMonthDay(date);
    }
  }

  onMessageSelect(event) {
    console.log(event);
    const selected = event.currentTarget.checked;
    this.messageSelect.emit({id: this.message.id, selected});
  }

  openViewMessageModal(){
    const modalRef = this.modalService.open(ViewMessageComponent, { windowClass: 'view-message-modal' });
    modalRef.componentInstance.message = this.message;
  }

}
