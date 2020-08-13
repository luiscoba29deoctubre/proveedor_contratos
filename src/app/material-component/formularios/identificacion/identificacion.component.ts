import { Component, OnInit } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Router } from "@angular/router";

import { SpinnerBlockService } from "../../../common/components/spinner-block/spinner-block.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "../../formulario.service";
import { Global } from "../../../common/Global";
import { Parameter } from "../../../common/domain/param/parameter";
import { IdentificacionDto } from '../../../common/DTO/form/IdentificacionDto';

interface ItemTipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-identificacion",
  templateUrl: "./identificacion.component.html",
  styleUrls: ["./identificacion.component.css"],
})
export class IdentificacionComponent implements OnInit {
  /** Formulario de identificacion */
  identificacionForm: FormGroup;
  /** Atributo forumulario para el bind del formulario de idenficacion */
  identificacion: IdentificacionDto;
  /** Flag que indica si el formulario 'Identificacion' ya se hizo submit */
  submitted: boolean;
  /** Para almacenar la lista de tipopersona */
  personas: Parameter[];

  contribuyentes: ItemTipo[] = [
    { value: "0", viewValue: "Entidad" },
    { value: "1", viewValue: "Especial" },
    { value: "2", viewValue: "Sociedad" },
    { value: "3", viewValue: "Obligada a llevar Contabilidad" },
    { value: "4", viewValue: "No obligada a llevar Contabilidad" },
    { value: "5", viewValue: "Régimen Impositivo Simplicado Ecuador" },
  ];

  proveedores: ItemTipo[] = [
    { value: "0", viewValue: "Nacional" },
    { value: "1", viewValue: "Extranjero" },
  ];

  categorias: ItemTipo[] = [
    { value: "0", viewValue: "Enseres" },
    { value: "1", viewValue: "Equipos" },
    { value: "2", viewValue: "Inmuebles" },
  ];

  detalleCategoria: ItemTipo[] = [
    { value: "0", viewValue: "Abrillantadoras" },
    { value: "1", viewValue: "Aires acondicionados" },
    { value: "2", viewValue: "Amplificadores de audio" },
  ];

  /**
   * Constructor del Componente {@link IdentificacionComponent}
   *
   * @param fb Builder de Formularios
   * @param router
   * @param spinner
   * @param formularioService
   * @param notifyService
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: SpinnerBlockService,
    private formularioService: FormularioService,
    private notifyService: NotificationService
  ) {
    this.personas = Global.lstTipoPersona;

    console.log("identificacion this.personas", this.personas);
    console.log("identificacion Global.lstTipoPersona", Global.lstTipoPersona);

    this.initForm();
  }
  // sacado de https://morioh.com/p/526559a86600 el Toast que muestra mensajes
  showToasterSuccess() {
    this.notifyService.showSuccess("Información guardada", "Información");
  }

  showToasterError() {
    this.notifyService.showError("Error al guardar información", "Error");
  }

  ngOnInit(): void {
    // cargamos con la informacion inicial al componente
    this.identificacionForm.controls["rucrise"].setValue(
      Global.identificacion.rucrise
    );
    this.identificacionForm.controls["nombrerazonsocial"].setValue(
      Global.identificacion.nombrerazonsocial
    );
    this.identificacionForm.controls["nombrecomercial"].setValue(
      Global.identificacion.nombrecomercial
    );
  }

  private initForm() {
    this.identificacionForm = this.fb.group({
      rucrise: [null, [Validators.required]],
      nombrerazonsocial: [null, [Validators.required]],
      nombrecomercial: [null, [Validators.required]],
  //    persona: [null, [Validators.required]],
      contribuyente: [null, [Validators.required]],
      proveedor: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
      detalle: [null, [Validators.required]],
    });
  }

  /**
   * Se envía el formulardio identificación
   *
   * @param value Valor del formulario
   */
  sendForm(value: any, valid: boolean) {
    this.submitted = true;

    // if (valid) {
    const identificaForm: IdentificacionDto = new IdentificacionDto();
    identificaForm.rucrise = value.rucrise;
    identificaForm.nombrerazonsocial = value.nombrerazonsocial;
    identificaForm.nombrecomercial = value.nombrecomercial;
    identificaForm.idtipopersona = +value.persona.value;

    console.log(" value.persona", value.persona.value);

    console.log("identificaForm", identificaForm);

    this.formularioService.saveIdentificacion(identificaForm).subscribe(
      (identificacion) => {
        console.log("regresa Identificacion", identificacion);

        Global.identificacion = identificaForm;

        console.log(
          "se imprime Global.globalIdentificacion",
          Global.identificacion
        );

        this.router.navigate(["/infocontacto"]);

        this.spinner.stop();
      },
      (error) => {
        console.log(error);
        this.spinner.stop();
      }
    );
  }
  // }

  test() {
    console.log("imprime ");
  }

  select(value) {
    console.log("=========", value);
  }
}
