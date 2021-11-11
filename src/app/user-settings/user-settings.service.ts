import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators'
import { Threshold } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  private threshold$: BehaviorSubject<Threshold>;
  constructor() {
    this.threshold$ = new BehaviorSubject<Threshold>({
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
    return this.threshold$.pipe(
        delay(1000), //fake delay from api call
        tap((thresh: Threshold) => console.log ('updated with ', thresh))
      )
  }

  setThreshold(threshold: Threshold) {
    this.threshold$.next({ ...threshold, message: 'Save Success!'});
  }
}
