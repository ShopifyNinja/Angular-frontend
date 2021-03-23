import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/core';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessage implements OnInit {

  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.layout.setCSSClass('content_container', 'p0');
  }

}
