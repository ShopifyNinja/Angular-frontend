import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';

import { MessageCenterRoutingModule } from './message-center-routing.module';
import { InboxItemComponent } from './inbox/inbox-item/inbox-item.component';
import { InboxActionsComponent } from './inbox/inbox-actions/inbox-actions.component';
import { DeletedMessagesService, DraftMessagesService, InboxMessagesService, MessagesModuleStateService, SentMessagesService } from './services/messages-module.service';
import { CreateMessageComponent } from './create-message/create-message.component';

import { MessageCenterComponent } from './message-center.component';
import { MessageComponent } from './message/message.component';
import { InboxComponent } from './inbox/inbox.component';
import { CreatePassword } from './create-password/create-password.component';
import { PasswordCreated } from './password-created/password-created.component';
import { NewMessage } from './new-message/new-message.component';
import { SortFiltersComponent } from './inbox/sort-filters/sort-filters.component';
import { SearchComponent } from './search/search.component';
import { BaseSectionComponent } from './inbox/base-section/base-section.component';
import { PaginationComponent } from './inbox/pagination/pagination.component';
import { ViewMessageComponent } from './view-message/view-message.component';
import { ReplyMessageComponent } from './reply-message/reply-message.component';
import { AttachFileComponent } from './attach-file/attach-file.component';
import { NgxFilesizeModule } from 'ngx-filesize';

@NgModule({
  declarations: [
    MessageCenterComponent,
    MessageComponent,
    CreateMessageComponent,
    InboxComponent,
    BaseSectionComponent,
    InboxItemComponent,
    InboxActionsComponent,
    SortFiltersComponent,
    SearchComponent,
    PaginationComponent,
    CreatePassword,
    PasswordCreated,
    NewMessage,
    ViewMessageComponent,
    ReplyMessageComponent,
    AttachFileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatCommonModule,
    MatTabsModule,
    InlineSVGModule,
    ContentLoaderModule,
    NgxFilesizeModule,
    MessageCenterRoutingModule,
  ],
  providers: [
    MessagesModuleStateService,
    InboxMessagesService,
    SentMessagesService,
    DeletedMessagesService,
    DraftMessagesService,
  ]
})
export class MessageCenterModule { }
