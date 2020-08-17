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
import { formularios, listas } from "../../../dashboard/indexedDB";

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

  contribuyentes: Parameter[];
  proveedores: Parameter[];
  actividades: Parameter[];
  categorias: Parameter[];
  catalogocategorias: Parameter[];

  // Seleccionamos o iniciamos el valor '0' del <select>
  opcionSeleccionado: Parameter;
  verSeleccion: string;

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
    this.spinner.show();
    this.store = formularios[0];

    console.log("this.storeeeeeeee", this.store);

    this.loadCombos();
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
        this.spinner.hide();
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

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado.name;
    console.log("this.opcionSeleccionado", this.opcionSeleccionado.name);
  }

  loadIdentificacion = (id) => {
    // cargamos con la informacion inicial al componente
    this.dbService.getByIndex(this.store, "id", id).then(
      (form) => {
        console.log("loadIdentificacion", form);

        this.identificacionForm.controls["rucrise"].setValue(form.rucrise);
        this.identificacionForm.controls["nombrerazonsocial"].setValue(
          form.nombrerazonsocial
        );
        this.identificacionForm.controls["nombrecomercial"].setValue(
          form.nombrecomercial
        );
        /*if (form.idtipopersona !== null) {
          this.identificacionForm.controls["idtipopersona"].setValue(
            form.idtipopersona
          );
        }*/
      },
      (error) => {
        console.log("getdata error", error);
      }
    );
  };

  private loadCombos() {
    /*const p1: Parameter = new Parameter(88, "ddddd");
    this.personas.push(p1);*/
    this.dbService.getAll(listas[0]).then(
      (personas) => {
        this.personas = personas;
      },
      (error) => {
        console.log(error);
      }
    );
    this.dbService.getAll(listas[1]).then(
      (proveedores) => {
        this.proveedores = proveedores;
      },
      (error) => {
        console.log(error);
      }
    );
    this.dbService.getAll(listas[2]).then(
      (contribuyentes) => {
        this.contribuyentes = contribuyentes;
      },
      (error) => {
        console.log(error);
      }
    );
    this.dbService.getAll(listas[3]).then(
      (actividades) => {
        this.actividades = actividades;
      },
      (error) => {
        console.log(error);
      }
    );
    this.dbService.getAll(listas[4]).then(
      (categorias) => {
        this.categorias = categorias;
      },
      (error) => {
        console.log(error);
      }
    );
    this.dbService.getAll(listas[5]).then(
      (catalogocategorias) => {
        this.catalogocategorias = catalogocategorias;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private initForm() {
    this.identificacionForm = this.fb.group({
      rucrise: [null, [Validators.required]],
      nombrerazonsocial: [null, [Validators.required]],
      nombrecomercial: [null, [Validators.required]],
      persona: [null, [Validators.required]],
      contribuyente: [null, [Validators.required]],
      actividad: [null, [Validators.required]],
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

      console.log("this.identificacionFormffff", this.identificacionForm);

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
