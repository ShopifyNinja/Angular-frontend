import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { StateService } from '../../shared/services/state.service';
import { Message } from '../../shared/interfaces/messages';
import { MessagesAppService } from '../../shared/services/messages-app.service';


export type MessagesObs = 'messages$' | 'sentMessages$' | 'deletedMessages$' | 'draftMessages$';
export type SelectedMessagesObs = 'selectedMessages$' | 'selectedSentMessages$' | 'selectedDeletedMessages$' | 'selectedDraftMessages$';

interface MessagesModuleState {
  selectedMessages?: string[];
  selectedSentMessages?: string[];
  selectedDraftMessages?: string[];
  selectedDeletedMessages?: string[];
}

const initialMessagesModuleState: MessagesModuleState = {
  selectedMessages: [],
  selectedSentMessages: [],
  selectedDraftMessages: [],
  selectedDeletedMessages: [],
};

@Injectable()
export class MessagesModuleStateService extends StateService<MessagesModuleState> {
  constructor() {
    super(initialMessagesModuleState);
  }
}

export abstract class BaseMessagesService {
  messages$: Observable<Message[]>;
  selectedMessages$: Observable<Message[]>;

  abstract messagesStateRef: string;
  abstract selectedMessagesStateRef: string;

  abstract type: string;

  constructor(
    private stateService: MessagesModuleStateService,
    private messagesAppService: MessagesAppService,
  ) {
    this.selectedMessages$ = this.stateService.select((state) => {
      const selected = messagesAppService.getState()[this.messagesStateRef]
        .filter(i => state[this.selectedMessagesStateRef].indexOf(i.messageId) >= 0);
      return selected;
    });
  }

  readMessage(message: Message) {

  }

  getSelectedMessages() {
    return this.stateService.state[this.selectedMessagesStateRef];
  }

  selectMessage(message: Message | string, selected = true) {
    const id = typeof message === 'string' ? message : message.messageId;
    const index = this.stateService.state[this.selectedMessagesStateRef].indexOf(id);

    if (index < 0) {
      if (selected) {
        this.stateService.setState({ [this.selectedMessagesStateRef]: [...this.stateService.state[this.selectedMessagesStateRef], id] });
      }
    } else {
      if (!selected) {
        this.stateService.state[this.selectedMessagesStateRef].splice(index, 1);
        const selectedMessages = [...this.stateService.state[this.selectedMessagesStateRef]];
        selectedMessages.splice(index, 1);
        this.stateService.setState({ [this.selectedMessagesStateRef]: selectedMessages });
      }
    }
  }

  // It's actully a toggle all
  selectAll(selected) {
    if (this.messagesAppService.getState()[this.messagesStateRef].length > this.stateService.state[this.selectedMessagesStateRef].length) {
      const selectedMessages = this.messagesAppService.getState()[this.messagesStateRef].map(m => m.messageId);
      this.stateService.setState({ [this.selectedMessagesStateRef]: selectedMessages });
    } else {
      if (!selected) {
        this.stateService.setState({ [this.selectedMessagesStateRef]: [] });
      }
    }
  }

  deleteSelected(): Promise<boolean> {
    const promise = this.messagesAppService.deleteMessages(this.stateService.state[this.selectedMessagesStateRef], this.type);

    this.stateService.setState({ [this.selectedMessagesStateRef]: [] });
    return promise;
  }

  restoreSelected() {
    return this.messagesAppService.restoreMessages(this.stateService.state.selectedDeletedMessages);
  }

  searchSuggestions(query): Promise<any[]> {
    const ret = query.length === 0 ? [] : [
      { value: 'Smith Lara', text: '<b>Smith</b>, Lara' },
      { value: 'Smith Karen', text: '<b>Smith</b>, Karen' },
      { value: 'Smith Jonathan', text: '<b>Smith</b>, Jonathan' },
    ];

    return of(ret).toPromise();
  }
}

@Injectable()
export class InboxMessagesService extends BaseMessagesService {
  messagesStateRef = 'messages';
  selectedMessagesStateRef = 'selectedMessages';

  type = 'inbox';

  constructor(
    stateService: MessagesModuleStateService,
    messagesAppService: MessagesAppService,
  ) {
    super(stateService, messagesAppService);
  }
}

@Injectable()
export class SentMessagesService extends BaseMessagesService {
  messagesStateRef = 'sentMessages';
  selectedMessagesStateRef = 'selectedSentMessages';

  type = 'sent';

  constructor(
    stateService: MessagesModuleStateService,
    messagesAppService: MessagesAppService,
  ) {
    super(stateService, messagesAppService);
  }
}

@Injectable()
export class DeletedMessagesService extends BaseMessagesService {
  messagesStateRef = 'deletedMessages';
  selectedMessagesStateRef = 'selectedDeletedMessages';

  type = 'deleted';

  constructor(
    stateService: MessagesModuleStateService,
    messagesAppService: MessagesAppService,
  ) {
    super(stateService, messagesAppService);
  }
}

@Injectable()
export class DraftMessagesService extends BaseMessagesService {
  messagesStateRef = 'draftMessages';
  selectedMessagesStateRef = 'selectedDraftMessages';

  type = 'draft';

  constructor(
    stateService: MessagesModuleStateService,
    messagesAppService: MessagesAppService,
  ) {
    super(stateService, messagesAppService);
  }
}
