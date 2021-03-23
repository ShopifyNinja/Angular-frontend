import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxFilesizeModule } from 'ngx-filesize';
import { CommonModule } from '@angular/common';

import { AuthService } from './modules/auth/_services/auth.service';
import { environment } from 'src/environments/environment';
import { FakeAPIService } from './_fake/fake-api.service';
import { AuthInterceptor } from './core/http-interceptors/auth-interceptor';
import { AppMonitoringService } from './core/services/app-monitoring.service';
import { SharedModule } from './modules/shared/shared.module';
import { DateOrTimePipe } from './core/filters/date.filter';
import { SettingsComponent } from './modules/settings/settings.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// #fake-end#

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}


@NgModule({
  declarations: [
    AppComponent,
    DateOrTimePipe,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SplashScreenModule,
    HttpClientModule,
    HighlightModule,
    ClipboardModule,
    ToastrModule.forRoot(),
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    ToastrModule.forRoot(),
    SharedModule,
    NgxFilesizeModule,
    CommonModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
          json: () => import('highlight.js/lib/languages/json')
        },
      },
    },
    { provide: 'API_URL', useValue: environment.apiUrl },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AppMonitoringService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
