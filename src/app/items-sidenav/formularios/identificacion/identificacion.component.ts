import { IdentificacionDto } from "./../../../common/dtos/form/IdentificacionDto";
import { Component, OnInit } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Router } from "@angular/router";

import { NotificationService } from "../../../shared/services/notification.service";

import { Parameter } from "../../../common/domain/param/parameter";

import { ProcessIDB } from "../../../shared/process.indexedDB";
import { NgxIndexedDBService } from "ngx-indexed-db";

import { NgxSpinnerService } from "ngx-spinner";
import { FormularioService } from "../formulario.service";
import { formularios, listas } from "../../../dashboard/indexedDB";
import { LoginService } from "../../../logueo/login/login.service";

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

  /** Para almacenar el nombre del store que almacena este componente */
  store: string;
  /** Para almacenar la lista de tipopersona */
  personas: Parameter[];
  contribuyentes: Parameter[];
  proveedores: Parameter[];
  actividades: Parameter[];
  categorias: Parameter[];
  catalogocategorias: Parameter[];

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
    private dbService: NgxIndexedDBService,
    private loginService: LoginService
  ) {
    this.spinner.show();
    this.store = formularios[0];

    console.log("this.storeeeeeeee", this.store);

    this.loadCombos();
    this.initForm();
    this.processIDB = new ProcessIDB(dbService); // creamos una instancia para manejar la base de datos
    console.log("entra en formsServices");
    this.formsService.getIdentificacion().subscribe(
      (identificacionDto) => {
        console.log(" llega allForms", identificacionDto);
        if (identificacionDto.estado) {
          // llenamos la base 'indexed-db'
          console.log("componente ", identificacionDto);
          this.processIDB.fillingIdentificacion(identificacionDto); // llenamos el store 'identificacionDto'
          this.loadIdentificacion(identificacionDto); // carga los datos en pantalla
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
    this.notifyService.showSuccess("guardada exitosamente", "Identificación");
  }

  showToasterError() {
    this.notifyService.showError("Error al guardar identificación", "Error");
  }

  ngOnInit(): void {
    this.loginService.checkToken(); // para que salga, cuando el token expire
  }

  loadIdentificacion = (identificacionDto: IdentificacionDto) => {
    // cargamos con la informacion inicial al componente
    this.dbService.getByIndex(this.store, "id", identificacionDto.id).then(
      (form) => {
        console.log("loadIdentificacion", form);

        this.identificacionForm.controls["rucrise"].setValue(form.rucrise);
        this.identificacionForm.controls["nombrerazonsocial"].setValue(
          form.nombrerazonsocial
        );
        this.identificacionForm.controls["nombrecomercial"].setValue(
          form.nombrecomercial
        );

        let persona: Parameter;
        this.personas.forEach((element) => {
          if (element.id == identificacionDto.idtipopersona) {
            persona = element;
          }
        });
        // console.log("persosssssssss", this.personas);
        this.identificacionForm.controls["persona"].setValue(persona);

        let proveedor: Parameter;
        this.proveedores.forEach((element) => {
          if (element.id == identificacionDto.idtipoproveedor) {
            proveedor = element;
          }
        });
        this.identificacionForm.controls["proveedor"].setValue(proveedor);

        /*  let contribuyente: Parameter;
        this.contribuyentes.forEach((element) => {
          if (element.id == identificacionDto.) {
            contribuyente = element;
          }
        });
        this.identificacionForm.controls["contribuyente"].setValue(contribuyente);
        */
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
      // console.log("this.identificacionFormffff", this.identificacionForm.value);
      this.formsService
        .saveIdentificacion(this.identificacionForm.value)
        .subscribe(
          (identificacionDto: IdentificacionDto) => {
            console.log("regresa Identificacion", identificacionDto);

            this.processIDB.fillingIdentificacion(identificacionDto);

            this.router.navigate(["/infocontacto"]);

            this.showToasterSuccess();
            this.spinner.hide();
          },
          (error) => {
            this.showToasterError();
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
