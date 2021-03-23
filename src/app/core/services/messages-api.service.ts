import { HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

import { ApiMessagesResponse, Message, MessagesFilters } from 'src/app/modules/shared/interfaces/messages';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService {
  apiUrl: string;

  constructor(
    protected http: HttpClient,
    protected authService: AuthService,
    @Inject('API_URL') apiUrl,
  ) {
    this.apiUrl = apiUrl;
  }

  getMessages(
    type: string = 'inbox',
    filters: MessagesFilters = {},
  ): Observable<ApiMessagesResponse> {
    const { page, perPage, query, sortBy, sortDirection } = filters;

    const params: any = {};
    if (query) { params.searchText = query; }
    if (sortBy) { params.sortBy = sortBy; }
    if (sortDirection) { params.sortDirection = sortDirection; }

    return this.http.get(this.apiUrl + `/Message/${type}/${page * perPage - perPage}/${perPage}`, { params })
      .pipe(
        retry(1),
        map((res: any) => res),
        catchError(this.handleError)
      );
  }

  createMessage(message: Message) {
    const formData: FormData = new FormData();
    message.attachments.forEach(attachment => formData.append('files', attachment));
    formData.set('body', message.body);
    formData.set('subject', message.subject);

    return this.http.post(this.apiUrl + '/Message/SendMessage', formData)
      .pipe(
        retry(0),
        //map((res: any) => res),
        catchError(this.handleError)
      );
  }

  saveDraftMessage(message: Message) {
    const formData: FormData = new FormData();
    message.attachments.forEach(attachment => formData.append('files', attachment));
    formData.set('body', message.body);
    formData.set('subject', message.subject);

    return this.http.post(this.apiUrl + '/Message/Draft/Save', formData)
      .pipe(
        retry(0),
        //map((res: any) => res),
        catchError(this.handleError)
      );
  }

  getMessage(messageId: string, type: string = 'inbox'): Observable<Message> {
    return this.http.get(this.apiUrl + `/Message/${type}/Read/${messageId}`)
      .pipe(
        retry(1),
        map((res: any) => res),
        catchError(this.handleError)
      );
  }

  replyMessage(parentId: string, message: Message) {
    const formData: FormData = new FormData();
    message.attachments.forEach(attachment => formData.append('files', attachment));
    formData.set('body', message.body);
    formData.set('subject', message.subject);
    formData.set('parentMessageId', parentId);

    const requestOptions: Object = {
      responseType: 'text'
    }

    return this.http.post(this.apiUrl + '/Message/ReplyMessage', formData, requestOptions)
      .pipe(
        retry(1),
        //map((res: any) => res.data),
        catchError(this.handleError)
      );
  }

  deleteInboxMessages(ids: string[]): Observable<boolean> {
    return this.http.post<Message>(this.apiUrl + '/Message/Inbox/Delete', ids)
      .pipe(
        retry(1),
        map((res: any) => res),
        catchError(this.handleError)
      );
  }

  deleteSentMessages(ids: string[]): Observable<boolean> {
    return this.http.post<Message>(this.apiUrl + '/Message/Sent/Delete', ids)
      .pipe(
        retry(1),
        map((res: any) => !!res),
        catchError(this.handleError)
      );
  }

  deleteDraftMessages(ids: string[]): Observable<boolean> {
    return this.http.post<Message>(this.apiUrl + '/Message/Draft/Delete', ids)
      .pipe(
        retry(1),
        map((res: any) => !!res),
        catchError(this.handleError)
      );
  }

  deleteDeletedMessages(ids: string[]): Observable<boolean> {
    let params = new HttpParams();
    params = params.set('body', JSON.stringify(ids));
    return this.http.delete<Message>(this.apiUrl + '/Message/Deleted/DeleteForever', { params })
      .pipe(
        retry(1),
        map((res: any) => !!res),
        catchError(this.handleError)
      );
  }

  restoreDeletedMessages(ids: string[]): Observable<boolean> {
    return this.http.post<Message>(this.apiUrl + '/Message/Deleted/Restore', ids)
      .pipe(
        retry(1),
        map((res: any) => !!res),
        catchError(this.handleError)
      );
  }

  getSubjects(): Observable<string[]> {
    return this.http.get(this.apiUrl + '/Message/Subjects')
      .pipe(
        retry(1),
        map((r: string[]) => r),
        catchError(this.handleError)
      );
  }

  getNotificationCount(): Observable<number> {
    return this.http.get(this.apiUrl + '/Message/NotificationCount')
      .pipe(
        retry(1),
        map((r: number) => r),
        catchError(err => { return this.handleError(err, this) })
      );
  }

  // Error handling
  handleError(error, self) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      if (error.status === 401) {
        self.authService.logout();
        return;
      }
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log('Api Error ', errorMessage);
    return throwError(errorMessage);
  }
}
