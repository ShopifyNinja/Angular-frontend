import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingBarService {
  loading = 0;

  private loadingSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loading$: Observable<boolean>;

  constructor() {
    this.loading$ = this.loadingSubject$.asObservable();
  }

  setLoading(loading: boolean = true) {
    if (loading) {
      this.loading++;
      if (this.loading === 1) {
        this.loadingSubject$.next(true);
      }
    } else {
      if (this.loading >= 1) {
        this.loading--;
        if (this.loading === 0) {
          this.loadingSubject$.next(false);
        }
      }
    }
  }
}
