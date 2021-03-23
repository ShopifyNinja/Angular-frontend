import { Component, OnInit, Input, ViewChild, Injectable, OnDestroy } from '@angular/core';

import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthModel } from '../../auth/_models/auth.model';
import { AuthService } from '../../auth/_services/auth.service';
import { environment } from 'src/environments/environment';

const PROSPECT_USER_URL = `${environment.apiUrl}/ProspectUser`;

@Injectable({
  providedIn: 'root',
})
export class ProspectUserService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) { };

  ngOnInit(): void {};

  requestQuote(fullName: string, zipCode: number, phone: string, email: string){
    return this.http.post(PROSPECT_USER_URL + '/RequestQuote', { fullName, zipCode, phone, email }, {responseType: 'text'}).pipe(
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
    );
  }

  generateSecurityCode(userId: string, via: string){
    const queryParams = '?userId=' + userId + '&via=' + via;
    return this.http.post(PROSPECT_USER_URL + '/GenerateSecurityCode' + queryParams, { responseType: 'text' }).pipe(
      map(() => {
        return true;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
    );
  }

  verifySecurityCode(userId: string, securityCode: string){
    const queryParams = '?userId=' + userId + '&securityCode=' + securityCode;
    return this.http.post(PROSPECT_USER_URL + '/VerifySecurityCode' + queryParams, { responseType: 'text' }).pipe(
      map((auth: AuthModel) => {
        const result = this.authService.setAuthFromLocalStorage(auth);
        return true;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
    );
  }
}
