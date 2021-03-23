import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoadingBarService } from './loading-bar.service';
import { StateService } from './state.service';
import { MessagesApiService, } from '../../../core/services/messages-api.service';
import { Message, MessagesFilters, MessagesAppState, ApiMessagesResponse } from '../interfaces/messages';

const defaultMessagesFilters: MessagesFilters = {
  page: 1,
  perPage: 200,
  query: null,
  sortBy: 'date',
  sortDirection: 'descending',
};

const initialMessagesAppState: MessagesAppState = {
  messages: [],
  messagesFilters: Object.assign({}, defaultMessagesFilters),
  totalMessages: 0,

  sentMessages: [],
  sentMessagesFilters: Object.assign({}, defaultMessagesFilters),
  totalSentMessages: 0,

  draftMessages: [],
  draftMessagesFilters: Object.assign({}, defaultMessagesFilters),
  totalDraftMessages: 0,

  deletedMessages: [],
  deletedMessagesFilters: Object.assign({}, defaultMessagesFilters),
  totalDeletedMessages: 0,

  subjects: [],
  notificationCount: 0,
};

@Injectable({
  providedIn: 'root'
})
export class MessagesAppStateService extends StateService<MessagesAppState> {
  constructor() {
    super(initialMessagesAppState);
  }

  public get state(): MessagesAppState {
    return this.state$.getValue();
  }
}

@Injectable({
  providedIn: 'root'
})
export class MessagesAppService {

  messages$: Observable<Message[]>;
  sentMessages$: Observable<Message[]>;
  draftMessages$: Observable<Message[]>;
  deletedMessages$: Observable<Message[]>;
  subjects$: Observable<string[]>;

  constructor(
    private stateService: MessagesAppStateService,
    private messagesApiService: MessagesApiService,
    private loadingBarService: LoadingBarService,
  ) {
    this.messages$ = this.stateService.select<Message[]>(state => {
      return state.messages;
    });

    this.sentMessages$ = this.stateService.select<Message[]>(state => {
      return state.sentMessages;
    });

    this.draftMessages$ = this.stateService.select<Message[]>(state => {
      return state.draftMessages;
    });

    this.deletedMessages$ = this.stateService.select<Message[]>(state => {
      return state.deletedMessages;
    });

    this.subjects$ = this.stateService.select<string[]>(state => {
      return state.subjects;
    });

  }

  getState(): MessagesAppState {
    return this.stateService.state;
  }

  selectState(part: string): Observable<any> {
    return this.stateService.select<any>(state => {
      return state[part];
    });
  }

  getFiltersObs(type: string): Observable<MessagesFilters> {
    switch (type) {
      case 'inbox':
        return this.selectState('messagesFilters');
      case 'sent':
        return this.selectState('sentMessagesFilters');
      case 'deleted':
        return this.selectState('deletedMessagesFilters');
      case 'draft':
        return this.selectState('draftMessagesFilters');
    }
  }

  getTotalObs(type: string): Observable<number> {
    switch (type) {
      case 'inbox':
        return this.selectState('totalMessages');
      case 'sent':
        return this.selectState('totalSentMessages');
      case 'deleted':
        return this.selectState('totalDeletedMessages');
      case 'draft':
        return this.selectState('totalDraftMessages');
    }
  }

  getMessagesObs(type: string): Observable<Message[]> {
    switch (type) {
      case 'inbox':
        return this.messages$;
      case 'sent':
        return this.sentMessages$;
      case 'deleted':
        return this.deletedMessages$;
      case 'draft':
        return this.draftMessages$;
    }
  }

  getMessagesFiltersStateRef(type: string): string {
    switch (type) {
      case 'inbox':
        return 'messagesFilters';
      case 'sent':
        return 'sentMessages';
      case 'deleted':
        return 'deletedMessages';
      case 'draft':
        return 'draftMessages';
    }
  }

  getTotalMessagesStateRef(type: string): string {
    switch (type) {
      case 'inbox':
        return 'totalMessages';
      case 'sent':
        return 'totalSentMessages';
      case 'deleted':
        return 'totalDeletedMessages';
      case 'draft':
        return 'totalDraftMessages';
    }
  }

  getMessage(messageId: string, type: string){
    console.log(this.stateService.state);
    return this.messagesApiService.getMessage(messageId, type);
  }

  getMessages(type: string = 'inbox', filters: MessagesFilters = {}) {
    let getMessagesCb: (r: ApiMessagesResponse) => void;
    switch (type) {
      case 'inbox':
        filters = Object.assign(this.stateService.state.messagesFilters, filters);
        getMessagesCb = (r) => {
          this.stateService.setState({ messages: r.data, totalMessages: r.total });
          this.loadingBarService.setLoading(false);
        };
        break;
      case 'sent':
        filters = Object.assign(this.stateService.state.sentMessagesFilters, filters);
        getMessagesCb = (r) => {
          this.stateService.setState({ sentMessages: r.data, totalSentMessages: r.total });
          this.loadingBarService.setLoading(false);
        };
        break;
      case 'draft':
        filters = Object.assign(this.stateService.state.draftMessagesFilters, filters);
        getMessagesCb = (r) => {
          this.stateService.setState({ draftMessages: r.data, totalDraftMessages: r.total });
          this.loadingBarService.setLoading(false);
        };
        break;
    }

    this.loadingBarService.setLoading(true);
    if (type === 'deleted') {
      this.getDeletedMessages(filters);
    } else {
      this.messagesApiService.getMessages(type, filters).subscribe(getMessagesCb);
    }
  }

  getDeletedMessages(filters: MessagesFilters = {}) {
    filters = Object.assign(this.stateService.state.deletedMessagesFilters, filters);
    this.messagesApiService.getMessages('deleted', filters).subscribe((r) => {
      this.stateService.setState({ deletedMessages: r.data, totalDeletedMessages: r.total });
      this.loadingBarService.setLoading(false);
    });
  }

  hasNextPage(type: string): boolean {
    const filters: MessagesFilters = this.stateService.state[this.getMessagesFiltersStateRef(type)];
    const total: number = this.stateService.state[this.getTotalMessagesStateRef(type)];

    return total > filters.perPage * filters.page;
  }

  nextPage(type: string) {
    const filters: MessagesFilters = this.stateService.state[this.getMessagesFiltersStateRef(type)];

    return this.getMessages(type, { page: filters.page + 1 });
  }

  hasPrevPage(type: string): boolean {
    const filters: MessagesFilters = this.stateService.state[this.getMessagesFiltersStateRef(type)];

    return filters.page > 1;
  }

  prevPage(type: string) {
    const filters: MessagesFilters = this.stateService.state[this.getMessagesFiltersStateRef(type)];

    return this.getMessages(type, { page: filters.page - 1 });
  }

  addMessage(message: Message): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.messagesApiService.createMessage(message).subscribe((resp) => {
        this.messagesApiService.getMessages('sent', this.stateService.state.sentMessagesFilters);
        res(true);
      }, () => rej(false));
    });
  }

  saveDraftMessage(message: Message): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.messagesApiService.saveDraftMessage(message).subscribe((resp) => {
        res(true);
      }, () => rej(false));
    });
  }

  replyMessage(parentId: string, message: Message): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.messagesApiService.replyMessage(parentId, message).subscribe((resp) => {
        this.messagesApiService.getMessages('sent', this.stateService.state.sentMessagesFilters);
        res(true);
      }, () => rej(false));
    });
  }

  getSubjects() {
    this.messagesApiService.getSubjects().subscribe((subjects: string[]) => {
      this.stateService.setState({ subjects });
    });
  }

  // getNotificationCount(): Promise<number> {
  //   return new Promise<number>((res, rej) => {
  //     this.messagesApiService.getNotificationCount().subscribe((notificationCount: number) => {
  //       this.stateService.setState({ notificationCount });
  //       res(notificationCount);
  //     }, () => rej(0));
  //   });
  // }

  getNotificationCount(): Observable<number> {
      return this.messagesApiService.getNotificationCount();
  }

  _optimisticDelete(ids: string[], type: string = 'inbox') {
    let messagesStateRef: string;
    switch (type) {
      case 'inbox':
        messagesStateRef = 'messages';
        break;
      case 'sent':
        messagesStateRef = 'sentMessages';
        break;
      case 'draft':
        messagesStateRef = 'draftMessages';
        break;
      case 'deleted':
        messagesStateRef = 'deletedMessages';
        break;
    }
    const newMessages = this.getState()[messagesStateRef]
      .filter(m => ids.indexOf(m.messageId) < 0);
    this.stateService.setState({ [messagesStateRef]: newMessages });
  }

  deleteInboxMessages(ids: string[]): Promise<boolean> {
    const promise = new Promise<boolean>((res, rej) => {
      this._optimisticDelete(ids, 'inbox');
      this.messagesApiService.deleteInboxMessages(ids).subscribe((success) => {
        res(success);
        if (success) {
          this.getMessages('inbox');
          this.getMessages('deleted');
        }
      });
    });

    return promise;
  }

  deleteSentMessages(ids: string[]): Promise<boolean> {
    const promise = new Promise<boolean>((res, rej) => {
      // Optimistically delete the message
      this._optimisticDelete(ids, 'sent');
      this.messagesApiService.deleteSentMessages(ids).subscribe((success) => {
        res(success);
        if (success) {
          this.getMessages('sent');
          this.getMessages('deleted');
        }
      });
    });

    return promise;
  }

  deleteDraftMessages(ids: string[]): Promise<boolean> {
    const promise = new Promise<boolean>((res, rej) => {
      this._optimisticDelete(ids, 'draft');
      this.messagesApiService.deleteDraftMessages(ids).subscribe((success) => {
        if (success) {
          this.getMessages('draft');
          this.getMessages('deleted');
        }
        res(success);
      });
    });

    return promise;
  }

  deleteDeletedMessages(ids: string[]): Promise<boolean> {
    const promise = new Promise<boolean>((res, rej) => {
      this._optimisticDelete(ids, 'deleted');
      this.messagesApiService.deleteDeletedMessages(ids).subscribe((success) => {
        if (success) {
          this.getMessages('deleted');
        }
        res(success);
      });
    });

    return promise;
  }

  deleteMessages(ids: string[], type = 'inbox'): Promise<boolean> {
    switch (type) {
      case 'inbox':
        return this.deleteInboxMessages(ids);
      case 'sent':
        return this.deleteSentMessages(ids);
      case 'deleted':
        return this.deleteDeletedMessages(ids);
      case 'draft':
        return this.deleteDraftMessages(ids);
    }
  }

  restoreMessages(ids: string[]): Promise<boolean> {
    const promise = new Promise<boolean>((res, rej) => {
      this._optimisticDelete(ids, 'deleted');
      this.messagesApiService.restoreDeletedMessages(ids).subscribe((success) => {
        if (success) {
          this.getMessages('inbox');
          this.getMessages('sent');
          this.getMessages('deleted');
          this.getMessages('draft');
        }
        res(success);
      });
    });

    return promise;
  }
}
