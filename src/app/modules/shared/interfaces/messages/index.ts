export interface MessagesFilters {
  page?: number;
  perPage?: number;
  query?: string;
  sortBy?: 'date' | 'from' | 'subject' | 'attachments' | 'unread';
  sortDirection?: 'descending' | 'ascending';
}

export interface Message {
  messageId?: string;
  subject?: string;
  senderName?: string;
  body: string;
  haveRead?: boolean;
  createdOn?: string;
  attachments?: string[];
}

export interface ApiMessagesResponse {
  total: number;
  data: Message[];
}

export interface MessagesAppState {
  messages?: Message[];
  messagesFilters: MessagesFilters;
  totalMessages: number;

  sentMessages?: Message[];
  sentMessagesFilters: MessagesFilters;
  totalSentMessages: number;

  draftMessages?: Message[];
  draftMessagesFilters: MessagesFilters;
  totalDraftMessages: number;

  deletedMessages?: Message[];
  deletedMessagesFilters: MessagesFilters;
  totalDeletedMessages: number;

  subjects?: string[];
  notificationCount: number;
}
