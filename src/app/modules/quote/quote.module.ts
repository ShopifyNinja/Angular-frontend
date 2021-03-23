import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { QuoteRoutingModule } from './quote-routing.module';
import { SharedModule } from '../shared/shared.module';

import { QuoteComponent } from './quote.component';
import { LandingComponent } from './landing/landing.component';
import { ConnectComponent } from './connect/connect.component';
import { CheckEmailComponent } from './check-email/check-email.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { EmailConfirmedComponent } from './email-confirmed/email-confirmed.component';
import { SubmitSecurityCode } from './submit-security-code/submit-security-code.component';

@NgModule({
  declarations: [
    QuoteComponent,
    LandingComponent,
    ConnectComponent,
    CheckEmailComponent,
    ConfirmEmailComponent,
    EmailConfirmedComponent,
    SubmitSecurityCode
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    QuoteRoutingModule,
  ]
})
export class QuoteModule { }
