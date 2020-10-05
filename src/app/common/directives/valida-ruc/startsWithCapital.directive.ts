import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS,
  Validator,
} from "@angular/forms";
import { Directive, Input } from "@angular/core";
import { validarCedula } from "./validar-cedula";

export function startsWithCapitalValidator(): ValidatorFn {
  function validarDigitoVerificador(ruc: string): boolean {
    const diezDigitosIniciales = ruc.substring(0, 10);
    const tercerDigito = Number(ruc.substring(2, 3));
    switch (tercerDigito) {
      case 6:
        return validarTercerDigitoSeis(diezDigitosIniciales);
      case 9:
        return validaTercerDigitoNueve(diezDigitosIniciales);
      default:
        return validarCedula(diezDigitosIniciales);
    }
  }

  function validarTercerDigitoSeis(diezDigitosIniciales: string) {
    const digitoUno = Number(diezDigitosIniciales.substring(0, 1));
    const digitoUnoMultiplicado = digitoUno * 3;
    const digitoDos = Number(diezDigitosIniciales.substring(1, 2));
    const digitoDosMultiplicado = digitoDos * 2;
    const digitoTres = Number(diezDigitosIniciales.substring(2, 3));
    const digitoTresMultiplicado = digitoTres * 7;
    const digitoCuatro = Number(diezDigitosIniciales.substring(3, 4));
    const digitoCuatroMultiplicado = digitoCuatro * 6;
    const digitoCinco = Number(diezDigitosIniciales.substring(4, 5));
    const digitoCincoMultiplicado = digitoCinco * 5;
    const digitoSeis = Number(diezDigitosIniciales.substring(5, 6));
    const digitoSeisMultiplicado = digitoSeis * 4;
    const digitoSiete = Number(diezDigitosIniciales.substring(6, 7));
    const digitoSieteMultiplicado = digitoSiete * 3;
    const digitoOcho = Number(diezDigitosIniciales.substring(7, 8));
    const digitoOchoMultiplicado = digitoOcho * 2;
    const digitoNueve = Number(diezDigitosIniciales.substring(8, 9));

    const digitoUnoMultiplicadoYSumado = sumaDigito(digitoUnoMultiplicado);
    const digitoDosMultiplicadoYSumado = sumaDigito(digitoDosMultiplicado);
    const digitoTresMultiplicadoYSumado = sumaDigito(digitoTresMultiplicado);
    const digitoCuatroMultiplicadoYSumado = sumaDigito(
      digitoCuatroMultiplicado
    );
    const digitoCincoMultiplicadoYSumado = sumaDigito(digitoCincoMultiplicado);
    const digitoSeisMultiplicadoYSumado = sumaDigito(digitoSeisMultiplicado);
    const digitoSieteMultiplicadoYSumado = sumaDigito(digitoSieteMultiplicado);
    const digitoOchoMultiplicadoYSumado = sumaDigito(digitoOchoMultiplicado);
    const sumaDePersonasNaturales =
      digitoUnoMultiplicadoYSumado +
      digitoDosMultiplicadoYSumado +
      digitoTresMultiplicadoYSumado +
      digitoCuatroMultiplicadoYSumado +
      digitoCincoMultiplicadoYSumado +
      digitoSeisMultiplicadoYSumado +
      digitoSieteMultiplicadoYSumado +
      digitoOchoMultiplicadoYSumado;
    const sumaDeSociedades =
      digitoUno +
      digitoDos +
      digitoTres +
      digitoCuatro +
      digitoCinco +
      digitoSeis +
      digitoSiete +
      digitoOcho;

    let verificadorDePersonasNaturales = 11 - (sumaDePersonasNaturales % 11);
    const verificadorDeSociedades = 11 - (sumaDeSociedades % 11);
    const verificadoresIgualAOnce =
      verificadorDePersonasNaturales === 11 || verificadorDeSociedades === 11;
    if (verificadoresIgualAOnce) {
      verificadorDePersonasNaturales = 0;
    }
    if (
      verificadorDePersonasNaturales === digitoNueve ||
      verificadorDeSociedades === digitoNueve
    ) {
      return true;
    } else {
      return validarCedula(diezDigitosIniciales);
    }
  }

  function validaTercerDigitoNueve(diezDigitosIniciales: string): boolean {
    const digitoUno = Number(diezDigitosIniciales.substring(0, 1));
    const digitoUnoMultiplicado = digitoUno * 4;
    const digitoDos = Number(diezDigitosIniciales.substring(1, 2));
    const digitoDosMultiplicado = digitoDos * 3;
    const digitoTres = Number(diezDigitosIniciales.substring(2, 3));
    const digitoTresMultiplicado = digitoTres * 2;
    const digitoCuatro = Number(diezDigitosIniciales.substring(3, 4));
    const digitoCuatroMultiplicado = digitoCuatro * 7;
    const digitoCinco = Number(diezDigitosIniciales.substring(4, 5));
    const digitoCincoMultiplicado = digitoCinco * 6;
    const digitoSeis = Number(diezDigitosIniciales.substring(5, 6));
    const digitoSeisMultiplicado = digitoSeis * 5;
    const digitoSiete = Number(diezDigitosIniciales.substring(6, 7));
    const digitoSieteMultiplicado = digitoSiete * 4;
    const digitoOcho = Number(diezDigitosIniciales.substring(7, 8));
    const digitoOchoMultiplicado = digitoOcho * 3;
    const digitoNueve = Number(diezDigitosIniciales.substring(8, 9));
    const digitoNueveMultiplicado = digitoNueve * 2;
    const digitoDiez = Number(diezDigitosIniciales.substring(9));

    const sumaDigitosMultiplicados =
      digitoUnoMultiplicado +
      digitoDosMultiplicado +
      digitoTresMultiplicado +
      digitoCuatroMultiplicado +
      digitoCincoMultiplicado +
      digitoSeisMultiplicado +
      digitoSieteMultiplicado +
      digitoOchoMultiplicado +
      digitoNueveMultiplicado;

    let verificador = 11 - (sumaDigitosMultiplicados % 11);
    if (verificador === 11) {
      verificador = 0;
    }

    if (verificador === 10) {
      return false;
    } else if (verificador === digitoDiez) {
      return true;
    }
    return false;
  }

  function sumaDigito(digito: number) {
    let sumaDigitos = digito;
    let valorUno = 0;
    let valorDos = 0;
    if (digito > 9) {
      valorUno = Number(digito.toString().substring(0, 1));
      valorDos = Number(digito.toString().substring(1, 2));
      sumaDigitos = valorUno + valorDos;
      if (sumaDigitos > 9) {
        sumaDigitos = sumaDigito(sumaDigitos);
      }
    }
    return sumaDigitos;
  }

  return (control: AbstractControl): ValidationErrors | null => {
    const ruc = <string>control.value;

    if (!control.value) {
      return null;
    }

    let valid: boolean;

    const noTieneTreceDigitos = ruc.length !== 13;
    if (noTieneTreceDigitos) {
      // valid = false;
      return valid ? null : { startsWithCapital: { value: control.value } };
    }
    const noTieneCeroCeroUnoAlFinal = !(ruc.substring(10) === "001");
    if (noTieneCeroCeroUnoAlFinal) {
      // valid = false;
      return valid ? null : { startsWithCapital: { value: control.value } };
    }

    valid = validarDigitoVerificador(ruc);

    return valid ? null : { startsWithCapital: { value: control.value } };
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: "[startsWithCapital]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StartsWithCapitalValidatorDirective,
      multi: true,
    },
  ],
})
export class StartsWithCapitalValidatorDirective implements Validator {
  @Input("startsWithCapital") isActive: boolean;

  validate(control: AbstractControl): ValidationErrors | null {
    return !this.isActive ? null : startsWithCapitalValidator()(control);
  }
}
