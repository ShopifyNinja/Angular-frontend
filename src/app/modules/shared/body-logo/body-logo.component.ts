import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-body-logo',
  template: `
    <a routerLink="/" class="logo">
      <img alt="US Health Group" src="./assets/media/logos/USH-logo.png" />
    </a>
  `,
  styleUrls: ['./body-logo.component.scss']
})
export class BodyLogoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

}
