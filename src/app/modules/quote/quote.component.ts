import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { sliderAnimation } from '../../core/animations/route.animations';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss'],
  animations: [
    sliderAnimation
  ],
})
export class QuoteComponent implements OnInit {

  constructor(
    public outlet: RouterOutlet,
  ) { }

  ngOnInit(): void {

  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
