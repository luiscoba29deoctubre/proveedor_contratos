import { Component, OnInit } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Router } from "@angular/router";

import { NotificationService } from "../../../shared/services/notification.service";

import { Parameter } from "../../../common/domain/param/parameter";

import { ProcessIDB } from "../../../shared/process.indexedDB";
import { NgxIndexedDBService } from "ngx-indexed-db";

import { NgxSpinnerService } from "ngx-spinner";
import { FormularioService } from "../formulario.service";
import { IdentificacionDto } from "../../../common/dtos/form/IdentificacionDto";
import { formularios } from "../../../dashboard/indexedDB";

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
  /** Objeto processIDB para llenar todos los datos del usuario */
  processIDB: ProcessIDB;
  /** Flag que indica si el formulario 'Identificacion' ya se hizo submit */
  submitted: boolean;
  /** Para almacenar la lista de tipopersona */
  personas: Parameter[];
  /** Para almacenar el nombre del store que almacena este componente */
  store: string;

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
    private spinner: NgxSpinnerService,
    private formsService: FormularioService,
    private notifyService: NotificationService,
    private dbService: NgxIndexedDBService
  ) {
    this.store = formularios[0];
    this.initForm();
    this.processIDB = new ProcessIDB(dbService);
    console.log("entra en formsServices");
    this.formsService.getIdentificacion().subscribe(
      (identificacionDto) => {
        console.log(" llega allForms", identificacionDto);
        if (identificacionDto.estado) {
          // llenamos la base 'indexed-db'
          console.log("componente ", identificacionDto);
          this.processIDB.fillingIdentificacion(identificacionDto); // llenamos el store 'identificacionDto'
          this.loadIdentificacion(identificacionDto.id); // carga los datos en pantalla
        }
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }
  // sacado de https://morioh.com/p/526559a86600 el Toast que muestra mensajes
  showToasterSuccess() {
    this.notifyService.showSuccess("Información guardada", "Información");
  }

  showToasterError() {
    this.notifyService.showError("Error al guardar información", "Error");
  }

  ngOnInit(): void {}

  loadIdentificacion = (id) => {
    // cargamos con la informacion inicial al componente
    this.dbService.getByIndex(this.store, "id", id).then(
      (form) => {
        console.log("getdata form", form);

        this.identificacionForm.controls["rucrise"].setValue(form.rucrise);
        this.identificacionForm.controls["nombrerazonsocial"].setValue(
          form.nombrerazonsocial
        );
        this.identificacionForm.controls["nombrecomercial"].setValue(
          form.nombrecomercial
        );
        
      },
      (error) => {
        console.log("getdata error", error);
      }
    );
  };

  private getData = (id) => {
    this.dbService.getByIndex(this.store, "id", id).then(
      (person) => {
        console.log("getdata person", person.rucrise);
        return person;
      },
      (error) => {
        console.log("getdata error", error);
      }
    );
  };

  private getDato = (name) => {
    this.dbService.getByIndex(this.store, "name", name).then(
      (person) => {
        console.log(person);
      },
      (error) => {
        console.log(error);
      }
    );
  };

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
    if (valid) {
      this.spinner.show();
      const identificaForm: IdentificacionDto = new IdentificacionDto();
      identificaForm.rucrise = value.rucrise;
      identificaForm.nombrerazonsocial = value.nombrerazonsocial;
      identificaForm.nombrecomercial = value.nombrecomercial;
      //    identificaForm.idtipopersona = +value.persona.value;

      //   console.log(" value.persona", value.persona.value);
      console.log("identificaForm", identificaForm);

      this.formsService.saveIdentificacion(identificaForm).subscribe(
        (identificacionDto: IdentificacionDto) => {
          console.log("regresa Identificacion", identificacionDto);

          this.processIDB.fillingIdentificacion(identificacionDto);

          this.router.navigate(["/infocontacto"]);

          this.spinner.hide();
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
        }
      );
    }
  }

  test() {
    console.log("imprime ");
  }

  select(value) {
    console.log("=========", value);
  }
}
