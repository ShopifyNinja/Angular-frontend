import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { LayoutService } from '../../../../_metronic/core';

@Component({
  selector: 'app-logo',
  template: `
    <a routerLink="/" class="logo">
      <img alt="Logo" [attr.src]="headerLogo" />
    </a>
  `,
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements OnInit, AfterViewInit {
  headerLogo = '';
  asideSelfDisplay = true;

  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.headerLogo = this.getLogoUrl();
  }

  ngAfterViewInit() {

  }

  private getLogoUrl() {
    const asideSelfDisplay = this.layout.getProp('aside.self.display');
    const headerSelfTheme = this.layout.getProp('header.self.theme') || '';
    const brandSelfTheme = this.layout.getProp('brand.self.theme') || '';

    let result = 'ushealth-group.svg';
    if (!asideSelfDisplay) {
      if (headerSelfTheme === 'light') {
        result = 'ushealth-group.svg';
      }
    } else {
      if (brandSelfTheme === 'light') {
        result = 'ushealth-group.svg';
      }
    }
    return `./assets/media/svg/logos/${result}`;
  }
}
