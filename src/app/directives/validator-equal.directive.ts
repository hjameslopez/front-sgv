import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';

@Directive({
  selector: '[appValidatorEqual]',
  providers: [{provide: NG_VALIDATORS, useExisting: ValidatorEqualDirective, multi: true}]
})

export class ValidatorEqualDirective implements Validator {
  @Input('appValidatorEqual') equalValue: string;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.equalValue ? equalValidator(new RegExp(this.equalValue, 'i'))(control)
      : null;
  }constructor() { }
}

export function equalValidator(expresion: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const equal = expresion.test(control.value);
    return equal ? {'equalValue': {value: control.value}} : null;
  };
}
