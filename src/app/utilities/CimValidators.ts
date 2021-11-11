import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";

type RequiredIfValidator = (predicate: () => boolean, validator: ValidatorFn) => ValidatorFn;

export module CimValidators {
  export const requiredIfValidator: RequiredIfValidator = (predicate, validator) => {
    //only run if we have the form control populated, and if predicate returns true
    return formControl => (formControl.parent && predicate() ?  validator(formControl) : null)
  }

  export const CurrencyFormatted = Validators.pattern(/^\$?^\-?[0-9]+(\.[0-9][0-9])?$/);

}
