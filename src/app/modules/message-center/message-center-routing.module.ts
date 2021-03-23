import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMessageComponent } from './create-message/create-message.component';
import { InboxComponent } from './inbox/inbox.component';
import { MessageCenterComponent } from './message-center.component';
import { MessageComponent } from './message/message.component';
import { CreatePassword } from './create-password/create-password.component';
import { PasswordCreated } from './password-created/password-created.component';
import { NewMessage } from './new-message/new-message.component';

const routes: Routes = [
  {
    path: '',
    component: MessageCenterComponent,
    children: [
      {
        path: '',
        redirectTo: 'inbox'
      },
      {
        path: 'inbox',
        component: InboxComponent,
        data: { animation: 11 },
      },
      {
        path: 'message',
        component: MessageComponent,
        data: { animation: 13 },
      },
      {
        path: 'create',
        component: CreateMessageComponent,
        data: { animation: 12 },
      },
      {
        path: 'create-password',
        component: CreatePassword
      },
      {
        path: 'password-created',
        component: PasswordCreated
      },
      {
        path: 'new-message',
        component: NewMessage
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageCenterRoutingModule { }
