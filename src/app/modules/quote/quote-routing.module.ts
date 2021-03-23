import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckEmailComponent } from './check-email/check-email.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ConnectComponent } from './connect/connect.component';
import { EmailConfirmedComponent } from './email-confirmed/email-confirmed.component';
import { LandingComponent } from './landing/landing.component';
import { QuoteComponent } from './quote.component';
import { SubmitSecurityCode } from './submit-security-code/submit-security-code.component';

const routes: Routes = [
  {
    path: '',
    component: QuoteComponent,
    children: [
      {
        path: '',
        redirectTo: 'landing'
      },
      {
        path: 'landing',
        component: LandingComponent,
        //data: { 'container-stretch': true, animation: 2 },
      },
      {
        path: 'connect',
        component: ConnectComponent,
        data: { },
      },
      {
        path: 'check-email/:type',
        component: CheckEmailComponent,
        data: { animation: 4 },
      },
      {
        path: 'confirm-email',
        component: ConfirmEmailComponent,
        data: { animation: 5 },
      },
      {
        path: 'email-confirmed',
        component: EmailConfirmedComponent,
        data: { animation: 6 }
      },
      {
        path: 'submit-security-code',
        component: SubmitSecurityCode
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteRoutingModule { }
