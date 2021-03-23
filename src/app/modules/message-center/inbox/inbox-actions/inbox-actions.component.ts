import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-inbox-actions',
  templateUrl: './inbox-actions.component.html',
  styleUrls: ['./inbox-actions.component.scss']
})
export class InboxActionsComponent implements OnInit {

  @Input() item: any;
  @Input() deleteEnabled?: any = true;
  @Input() withRestore?: any = false;
  @Input() showSelect: boolean;

  @Output() selectAll = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<void>();
  @Output() restore = new EventEmitter<void>();

  constructor() {

  }

  ngOnInit(): void {

  }

  onSelect($event) {
    const selected = $event.currentTarget.checked;
    this.selectAll.emit(selected);
  }

  onDelete() {
    if (this.deleteEnabled) {
      this.delete.emit();
    }
  }

  onRestore() {
    if (this.withRestore && this.deleteEnabled) {
      this.restore.emit();
    }
  }

}
