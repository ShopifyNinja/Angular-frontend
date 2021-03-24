import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthComponent} from './auth.component';
import {ExternalAuthComponent} from './external/external.component';
import {LoginComponent} from './login/login.component';
import {ForgotUsernameComponent} from './forgot-username/forgot-username.component';

//import {RegistrationComponent} from './registration/registration.component';
//import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
// import {LogoutComponent} from './logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {
          returnUrl: window.location.pathname,
          animation: 6
        }
      },
      {
        path: 'forgot-username',
        component: ForgotUsernameComponent,
        data: {
          animation: 6
        }
      },
      {
        path: 'external',
        component: ExternalAuthComponent,
      },
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '**', redirectTo: 'login', pathMatch: 'full'},
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AuthRoutingModule {}
