import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-horizontal-line',
  template: `
    <hr />
  `,
  styleUrls: ['./horizontal-line.component.scss']
})
export class HorizontalLineComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
