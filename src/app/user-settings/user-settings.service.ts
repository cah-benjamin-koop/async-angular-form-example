import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators'
import { Threshold } from './Threshold';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  private threshold$: BehaviorSubject<Threshold>;
  constructor() {
    this.threshold$ = new BehaviorSubject<Threshold>({
      loading: false,
      enabled: false,
      value: 100,
      error: false,
      message: '',
    })
  }

  updateThreshold() {
    this.threshold$.next({
      ...this.threshold$.value,
      error: false,
      message: '',
    })
  }


  getThreshold(): Observable<Threshold> {
    return this.threshold$;
  }

  setThreshold(threshold: Omit<Threshold, 'loading' | 'message' | 'error'>) {
    of(threshold).pipe(
      tap(() => {
        console.log('set to loading')
        this.threshold$.next({
          ...this.threshold$.value,
          message: '',
          loading: true
        })
      }),
      delay(1000),
      tap(() => {
        console.log('done')
        this.threshold$.next({
          ...threshold,
          error: false,
          message: 'Save Success!',
          loading: false,
        })
      })
      ).toPromise();
  }
}
