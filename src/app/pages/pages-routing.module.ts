import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/guards/auth.guard';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // {
      //   path: 'auth',
      //   loadChildren: () =>
      //     import('../modules/auth/auth.module').then((m) => m.AuthModule),
      // },
      {
        path: '',
        redirectTo: 'quote'
      },
      {
        path: 'quote',
        loadChildren: () =>
          import('../modules/quote/quote.module').then((m) => m.QuoteModule),
        data: { animation: 1 },
      },
      {
        path: 'message-center',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../modules/message-center/message-center.module').then((m) => m.MessageCenterModule),
        data: { animation: 2 },
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
