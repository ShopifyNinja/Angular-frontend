import { Component, OnInit, ElementRef, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-attach-file',
  templateUrl: './attach-file.component.html',
  styleUrls: ['./attach-file.component.scss']
})
export class AttachFileComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Output() onAttachmentsChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild('fileInput') fileInput: ElementRef;
  public attachments: string[] = [];
  display: boolean = false;

  constructor(
    public changeDetection: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  onAttachClick(e) {
    e.preventDefault();
    this.fileInput.nativeElement.click();
  }

  onFileChange(e) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < e.target.files.length; i++) {
      this.attachments.push(e.target.files[i]);
      console.log(e.target.files[i]);
    }
    this.onAttachmentsChanged.emit();
  }

  public removeFile(index){
    this.attachments.splice(index, 1);
    this.onAttachmentsChanged.emit();
  }

  public open(){
    this.display = true;
  }

  public close(){
    this.display = false;
  }
}
