import { Directive, Input } from "@angular/core";
import {
  ValidatorFn,
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS,
} from "@angular/forms";

export function validaRuc(): ValidatorFn {
  console.log("entra a validar start");

  return (control: AbstractControl): ValidationErrors | null => {
    const ruc = <string>control.value;

    if (!control.value) {
      return null;
    }

    let valid: boolean; //  /^[A-Z]/.test(control.value);

    const noTieneTreceDigitos = ruc.length !== 13;
    if (noTieneTreceDigitos) {
      valid = false; // { valida: { message: "ruc incorrecto" } }; // false;
    }
    const noTieneCeroCeroUnoAlFinal = !(ruc.substring(10) === "001");
    if (noTieneCeroCeroUnoAlFinal) {
      valid = false; // { valida: { message: "ruc incorrecto" } }; // false;
    }

    valid = this.validarDigitoVerificador(ruc);

    return valid ? null : { startWithCapital: { value: control.value } };
  };
}

@Directive({
  selector: "[appMyDirective]",
  providers: [
    { provide: NG_VALIDATORS, useExisting: MyDirectiveDirective, multi: true },
  ],
})
export class MyDirectiveDirective implements Validator {
  // tslint:disable-next-line: no-input-rename
  @Input("startCapital") isActive: boolean;
  validate(control: AbstractControl): ValidationErrors | null {
    return !this.isActive ? null : validaRuc()(control);
  }
}
