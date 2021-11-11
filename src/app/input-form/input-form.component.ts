import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, Subject } from 'rxjs';
import { tap, map, takeUntil } from 'rxjs/operators';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { Threshold } from '../user-settings/Threshold';
import { CimValidators } from '../utilities/CimValidators';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  threshold$: Observable<Threshold>;
  destroy$: Subject<void>;


  constructor(
    private userSettings: UserSettingsService,
    private formBuilder: FormBuilder
  ) { }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.destroy$ = new Subject<void>();
    this.form = this.formBuilder.group({
      enabled: [false],
      value: [ 0, CimValidators.requiredIfValidator(
            () => this.form.get('enabled').value,
            Validators.compose([
              Validators.required,
              Validators.min(0),
              Validators.minLength(1),
              Validators.maxLength(15),
              CimValidators.CurrencyFormatted,
            ])
          ),
        ],
    })
    this.threshold$ = this.userSettings.getThreshold()
      // this tap updates the form's values when a new value comes in from end point. this is a permanent loop, we could do without the destroy with a toPromise for a single call
      .pipe(tap(({ value , ...rest}) =>
        this.form.patchValue({ value: (+value).toFixed(2), ...rest })
      ));

    // this code handles enabling or disabling the input field for the value based on another field
    this.form.get("enabled").valueChanges
      //this is another way to kill observables when the page unloads without having to save each to their own variable
      .pipe(takeUntil(this.destroy$))
      .subscribe(enabled => enabled
        ? this.form.get('value').enable()
        : this.form.get('value').disable()
    )
  }

  submit() {
    if (this.form.valid) {
      this.userSettings.setThreshold({
        enabled: this.form.value.enabled,
        value: +(this.form.value?.value?.replace("$", "") ?? 0),
      });
    } else {
      console.warn("not valid! we could also display a message on page")
    }
  }

}
