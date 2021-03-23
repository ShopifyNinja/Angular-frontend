import { Component, OnInit } from '@angular/core';
import { LoadingBarService as NgxLoadingBarService } from '@ngx-loading-bar/core';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '../services/loading-bar.service';

@Component({
  selector: 'app-loading-bar',
  template: `
    <ngx-loading-bar color="#DB0037" height="5px"></ngx-loading-bar>
  `,
  /* styleUrls: ['./loading-bar.component.scss'] */
})
export class LoadingBarComponent implements OnInit {
  loader: LoadingBarState;

  constructor(
    ngxLoadingBar: NgxLoadingBarService,
    loadingBarService: LoadingBarService,
  ) {

    loadingBarService.loading$.subscribe(loading => {
      if (loading) {
        ngxLoadingBar.useRef().start();
      } else {
        ngxLoadingBar.useRef().complete();
      }
    });
  }

  ngOnInit(): void {

  }
}
