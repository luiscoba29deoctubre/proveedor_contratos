import { Directive, Input } from "@angular/core";
import { validarCedula } from "./validar-cedula";
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from "@angular/forms";

@Directive({
  selector: "[appValidaRuc]",
  providers: [
    { provide: NG_VALIDATORS, useExisting: ValidaRucDirective, multi: true },
  ],
})
export class ValidaRucDirective implements Validator {
  constructor() {}
  validate(control: AbstractControl): ValidationErrors {
    const ruc = <string>control.value;
    let valid: boolean;

    console.log("entra en la validacion jejeje ");

    const noTieneTreceDigitos = ruc.length !== 13;
    if (noTieneTreceDigitos) {
      valid = false; // { valida: { message: "ruc incorrecto" } }; // false;
    }
    const noTieneCeroCeroUnoAlFinal = !(ruc.substring(10) === "001");
    if (noTieneCeroCeroUnoAlFinal) {
      valid = false; // return { valida: { message: "ruc incorrecto" } }; // false;
    }

    valid = this.validarDigitoVerificador(ruc);

    return valid ? null : { startsWithCapital: { value: control.value } };
  }

  validarDigitoVerificador(ruc: string): any {
    // boolean {
    const diezDigitosIniciales = ruc.substring(0, 10);
    const tercerDigito = Number(ruc.substring(2, 3));
    switch (tercerDigito) {
      case 6:
        return this.validarTercerDigitoSeis(diezDigitosIniciales);
      case 9:
        return this.validaTercerDigitoNueve(diezDigitosIniciales);
      default:
        return validarCedula(diezDigitosIniciales);
    }
  }

  validarTercerDigitoSeis(diezDigitosIniciales: string) {
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

    const digitoUnoMultiplicadoYSumado = this.sumaDigito(digitoUnoMultiplicado);
    const digitoDosMultiplicadoYSumado = this.sumaDigito(digitoDosMultiplicado);
    const digitoTresMultiplicadoYSumado = this.sumaDigito(
      digitoTresMultiplicado
    );
    const digitoCuatroMultiplicadoYSumado = this.sumaDigito(
      digitoCuatroMultiplicado
    );
    const digitoCincoMultiplicadoYSumado = this.sumaDigito(
      digitoCincoMultiplicado
    );
    const digitoSeisMultiplicadoYSumado = this.sumaDigito(
      digitoSeisMultiplicado
    );
    const digitoSieteMultiplicadoYSumado = this.sumaDigito(
      digitoSieteMultiplicado
    );
    const digitoOchoMultiplicadoYSumado = this.sumaDigito(
      digitoOchoMultiplicado
    );
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
      return; // { valida: { message: "ruc correcto" } }; // true;
    } else {
      return validarCedula(diezDigitosIniciales);
    }
  }

  validaTercerDigitoNueve(diezDigitosIniciales: string): any {
    // boolean {
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
      return { valida: { message: "ruc incorrecto" } }; // false;
    } else if (verificador === digitoDiez) {
      return; // { valida: { message: "ruc correcto" } }; // true;
    }
    return { valida: { message: "ruc incorrecto" } }; // false;
  }

  sumaDigito(digito: number) {
    let sumaDigitos = digito;
    let valorUno = 0;
    let valorDos = 0;
    if (digito > 9) {
      valorUno = Number(digito.toString().substring(0, 1));
      valorDos = Number(digito.toString().substring(1, 2));
      sumaDigitos = valorUno + valorDos;
      if (sumaDigitos > 9) {
        sumaDigitos = this.sumaDigito(sumaDigitos);
      }
    }
    return sumaDigitos;
  }
}
