import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { sliderAnimation } from '../../core/animations/route.animations';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss'],
  animations: [
    sliderAnimation
  ],
})
export class MessageCenterComponent implements OnInit {

  constructor(
    public outlet: RouterOutlet,
  ) { }

  ngOnInit(): void {

  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
