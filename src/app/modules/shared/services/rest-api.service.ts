import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export class RestApiService<T> {

  constructor(
    protected http: HttpClient,
    protected apiUrl: string,
    protected resourcePath: string,
  ) { }

  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })
  };

  setResourcePath(path) {
    this.resourcePath = path;
  }

  // HttpClient API get() method => Fetch models list
  getModels(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl + this.resourcePath)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // HttpClient API get() method => Fetch model
  getModel(id): Observable<T> {
    return this.http.get<T>(this.apiUrl + this.resourcePath + '/' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // HttpClient API post() method => Create model
  createModel(model: T): Observable<T> {
    return this.http.post<T>(this.apiUrl + this.resourcePath, model, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // HttpClient API put() method => Update model
  updateModel(id, model: T): Observable<T> {
    return this.http.put<T>(this.apiUrl + this.resourcePath + '/' + id, model, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // HttpClient API delete() method => Delete model
  deleteModel(id) {
    return this.http.delete<T>(this.apiUrl + this.resourcePath + '/' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log('Api Error ', errorMessage);
    return throwError(errorMessage);
  }

}
