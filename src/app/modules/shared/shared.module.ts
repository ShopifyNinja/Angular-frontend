import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingBarModule as NgxLoadingBarModule } from '@ngx-loading-bar/core';

import { BodyLogoComponent } from './body-logo/body-logo.component';
import { HorizontalLineComponent } from './horizontal-line/horizontal-line.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';


@NgModule({
  declarations: [
    BodyLogoComponent,
    HorizontalLineComponent,
    LoadingBarComponent,
  ],
  imports: [
    CommonModule,
    NgxLoadingBarModule,
  ],
  exports: [
    BodyLogoComponent,
    HorizontalLineComponent,
    LoadingBarComponent,
  ],
  providers: []
})
export class SharedModule { }
