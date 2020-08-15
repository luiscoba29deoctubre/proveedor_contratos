import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Parameter } from "../../../common/domain/param/parameter";
import { IdentificacionDto } from '../../../common/dtos/form/IdentificacionDto';

interface ItemTipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-info-contacto",
  templateUrl: "./info-contacto.component.html",
  styleUrls: ["./info-contacto.component.css"],
})
export class InfoContactoComponent implements OnInit {
  /** Formulario de identificacion */
  infocontactoForm: FormGroup;
  /** Atributo forumulario para el bind del formulario de idenficacion */
  identificacion: IdentificacionDto;
  /** Flag que indica si el formulario 'Identificacion' ya se hizo submit */
  submitted: boolean;

  paises: ItemTipo[] = [
    { value: "0", viewValue: "Natural" },
    { value: "1", viewValue: "Juridica" },
  ];

  provincias: ItemTipo[] = [
    { value: "0", viewValue: "Pichincha" },
    { value: "1", viewValue: "Guayas" },
  ];

  cantones: ItemTipo[] = [
    { value: "0", viewValue: "Quito" },
    { value: "1", viewValue: "Machala" },
  ];

  parroquias: ItemTipo[] = [
    { value: "0", viewValue: "Comite del pueblo" },
    { value: "1", viewValue: "El Inca" },
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}
  private initForm() {
    this.infocontactoForm = this.fb.group({
      direccion: [null, [Validators.required]],
      telefono0: [null, [Validators.required]],
      pais: [null, [Validators.required]],
      provincia: [null, [Validators.required]],
      canton: [null, [Validators.required]],
      parroquia: [null, [Validators.required]],
      contactocomercial: [null, [Validators.required]],
      telefonocomercial: [null, [Validators.required]],
      celular1: [null, [Validators.required]],
      correo1: [null, [Validators.required]],
      celular2: [null, [Validators.required]],
      correo2: [null, [Validators.required]],
    });
  }

  /**
   * Se envía el formulario info-contacto
   *
   * @param value Valor del formulario
   */
  sendForm(value: any, valid: boolean) {
    this.submitted = true;
  }
}
