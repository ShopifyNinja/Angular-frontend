import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/_metronic/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.layout.setCSSClass('content_container', 'p0');
  }

}
