import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotUsernameComponent } from './forgot-username/forgot-username.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthComponent } from './auth.component';
import { ExternalAuthComponent } from './external/external.component';

import { SharedModule } from '../shared/shared.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotUsernameComponent,
    LogoutComponent,
    AuthComponent,
    ExternalAuthComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ]
})
export class AuthModule {}
