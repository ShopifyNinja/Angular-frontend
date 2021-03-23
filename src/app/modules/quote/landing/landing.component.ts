import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LayoutService } from 'src/app/_metronic/core';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(
    private layout: LayoutService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.layout.setCSSClass('content_container', 'p0');
  }

}
