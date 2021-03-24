import { Injectable, OnDestroy } from '@angular/core';
import { HttpParameterCodec } from "@angular/common/http";
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UserModel } from '../_models/user.model';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';


const LOGIN_URL = `${environment.apiUrl}/Authenticate`;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();

    // I don't know if I need the following, it is duplicating my calls (Metronic's original):
    /* const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr); */
  }

  // public methods
  getLoginUrl(){
    let redirectUrl = window.location.protocol + '//' + window.location.host + '/auth/external';
    console.log(redirectUrl);
    
    // let b2cUrl = 'https://ushealthuat.b2clogin.com/ushealthuat.onmicrosoft.com/oauth2/v2.0/authorize?' +
    //               'p=B2C_1A_signup_signin&client_id=7e6d76b2-dcd7-44f1-9a99-f7bb84baa5b7&nonce=defaultNonce&redirect_uri=' +
    //               encodeURIComponent(redirectUrl) + '&scope=openid&response_type=id_token&prompt=login'

    // return b2cUrl;
    let loginUrl = '/auth/login';
    return loginUrl;
  }

  login(username: string, password: string): Observable<UserModel> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(username, password).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.currentUserSubject.next(undefined);
    this.router.navigate(['/quote/landing'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserModel> {
    const user = this.getAuthFromLocalStorage();
    if (!user || !user.token) {
      return of(undefined);
    }

    // We don't have an endpoint to get the user based on the token
    // instead the Authenticate endpoint already return the user
    this.currentUserSubject.next(user);
    return of(user);

    /* this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.token).pipe(
      map((user: UserModel) => {
        if (user) {
          this.currentUserSubject = new BehaviorSubject<UserModel>(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    ); */
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.username, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  createPassword(user: UserModel, password: string): Observable<boolean> {
    // API to be implemented

    return of(true);
  }

  public userHasPassword(): boolean{
    return this.currentUserValue.type !== 'PCUSTNAP';
  }

  public userIsMember(): boolean{
    return this.currentUserValue.type === 'CUSTWP' ||
          this.currentUserValue.type === 'CUSTWCP';
  }

  public userIsProspect(): boolean{
    return this.currentUserValue.type === 'PCUSTWAP' ||
          this.currentUserValue.type === 'PCUSTNAP';
  }

  setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth token/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.token) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  // private methods
  private getAuthFromLocalStorage(): UserModel {
    try {
      const userDate = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return userDate;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
