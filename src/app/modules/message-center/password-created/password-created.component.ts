import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/core';

@Component({
  selector: 'app-password-created',
  templateUrl: './password-created.component.html',
  styleUrls: ['./password-created.component.scss']
})
export class PasswordCreated implements OnInit {

  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.layout.setCSSClass('content_container', 'p0');
  }

}
