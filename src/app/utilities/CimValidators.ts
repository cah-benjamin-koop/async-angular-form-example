import { Validators } from "@angular/forms";

export module CimValidators {
  export const requiredIfValidator = (predicate, validator) => {
    return formControl => (formControl.parent && predicate() ?  validator(formControl) : null)
  }

  export const CurrencyFormatted = Validators.pattern(/^\$?[0-9]+(\.[0-9][0-9])?$/);
}
