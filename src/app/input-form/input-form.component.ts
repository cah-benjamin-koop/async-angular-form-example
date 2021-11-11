import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { Threshold } from '../user-settings/user';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnInit {
  form: FormGroup;
  threshold$: Observable<Threshold>;
  

  constructor(
    private userSettings: UserSettingsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      enabled: [false],
      value: {
        value: 0,
        validators: Validators.compose([
          this.requiredIfValidator(
            () => this.form.get('enabled').value, 
            Validators.compose([
              Validators.required,
              Validators.min(1),
              Validators.minLength(1),
              Validators.pattern(/^\$?[0-9]+(\.[0-9][0-9])?$/),
            ])
          ),
          ]
        )
      },
    })
    this.threshold$ = this.userSettings.getThreshold()
      .pipe(tap(threshold => this.form.patchValue(threshold)));

    this.form.get("enabled").valueChanges.subscribe(v => v 
        ? this.form.get('value').enable()
        : this.form.get('value').disable()
    )
  }
  
  requiredIfValidator(predicate, validator) {
    return (formControl => {
      if (!formControl.parent) {
        return null;
      }
      return (predicate() ?  validator(formControl) : null)
    })
  }
  submit() {
    if (this.form.valid) {
      this.userSettings.setThreshold({
        enabled: this.form.value.enabled,
        value: +(this.form.value.value ?? 0),
        error: false,
        message: '',
      });
    } else {
      console.warn("not valid!")
    }
  }

}
