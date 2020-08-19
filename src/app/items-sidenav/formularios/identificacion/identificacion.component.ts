import { IdentificacionDto } from "./../../../common/dtos/form/IdentificacionDto";
import { Component, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";

import { Router } from "@angular/router";

import { NotificationService } from "../../../shared/services/notification.service";

import {
  Parameter,
  ParameterContribuyente,
} from "../../../common/domain/param/parameters";

import { ProcessIDB } from "../../../shared/bd/process.indexedDB";
import { NgxIndexedDBService } from "ngx-indexed-db";

import { NgxSpinnerService } from "ngx-spinner";
import { FormularioService } from "../formulario.service";
import { listas } from "../../../shared/bd/indexedDB";
import { LoginService } from "../../../logueo/login/login.service";
import { Parameter22 } from "../../../common/domain/param/parameters";
import { async } from "@angular/core/testing";

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
  contribuyentes: ParameterContribuyente[];
  contribuyentesCompleto: ParameterContribuyente[];
  proveedores: Parameter[];
  actividades: Parameter[];
  categorias: Parameter[];
  catalogocategorias: Parameter[];

  opcionSeleccionado: Parameter;
  verSeleccion: number;

  collaborators: FormArray;

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
   // this.spinner.show();

    // anulamos para mostrar que deben de 'seleccionar value'
    this.opcionSeleccionado = null;

    this.initForm();
    this.processIDB = new ProcessIDB(dbService); // creamos una instancia para manejar la base de datos
    console.log("entra en formsServices");
    this.formsService.getIdentificacion().subscribe(
      (identificacionDto) => {
        console.log(" llega allForms", identificacionDto);
        if (identificacionDto.estado) {
          // llenamos la base 'indexed-db'
          console.log("componente ", identificacionDto);

          this.loadIdentificacion(identificacionDto); // carga los datos en pantalla
        }
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );

    this.loadCombos();
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

  private initForm() {
    this.identificacionForm = this.fb.group({
      rucrise: [null, [Validators.required]],
      nombrerazonsocial: [null, [Validators.required]],
      nombrecomercial: [null, [Validators.required]],
      persona: [null, [Validators.required]],
      contribuyente: [null, [Validators.required]],
      proveedor: [null, [Validators.required]],

      lstActividades: this.fb.array([
        this.fb.group({
          actividad: [null, [Validators.required]],
          categoria: [null, [Validators.required]],
          detalle: [null, [Validators.required]],
        }),
      ]),
    });
  }

  get getActividades() {
    return this.identificacionForm.get("lstActividades") as FormArray;
  }

  addNewActividad() {
    this.getActividades.push(
      this.fb.group({
        actividad: [null, [Validators.required]],
        categoria: [null, [Validators.required]],
        detalle: [null, [Validators.required]],
      })
    );
  }

  loadIdentificacion = (i: IdentificacionDto) => {
    // cargamos con la informacion inicial al componente
    this.identificacionForm.controls["rucrise"].setValue(i.rucrise);
    this.identificacionForm.controls["nombrerazonsocial"].setValue(
      i.nombrerazonsocial
    );
    this.identificacionForm.controls["nombrecomercial"].setValue(
      i.nombrecomercial
    );

    let persona: Parameter;
    this.personas.forEach((element) => {
      if (element.id === i.idtipopersona) {
        persona = element;
      }
    });
    this.identificacionForm.controls["persona"].setValue(persona);

    let proveedor: Parameter;
    this.proveedores.forEach((element) => {
      if (element.id === i.idtipoproveedor) {
        proveedor = element;
      }
    });
    this.identificacionForm.controls["proveedor"].setValue(proveedor);

    let contribuyente: Parameter;
    this.contribuyentes.forEach((element) => {
      if (element.id === i.idtipocontribuyente) {
        contribuyente = element;
      }
    });
    this.identificacionForm.controls["contribuyente"].setValue(contribuyente);
    /*
        let actividad: Parameter;
        this.actividades.forEach((element) => {
          if (element.id === identificacionDto.idactividad) {
            actividad = element;
          }
        });
        this.identificacionForm.controls["actividad"].setValue(actividad);

        let categoria: Parameter;
        this.categorias.forEach((element) => {
          if (element.id === identificacionDto.idcategoria) {
            categoria = element;
          }
        });
        this.identificacionForm.controls["categoria"].setValue(categoria);

        let catalogoCategoria: Parameter;
        this.catalogocategorias.forEach((element) => {
          if (element.id === identificacionDto.idcatalogocategoria) {
            catalogoCategoria = element;
          }
        });
        this.identificacionForm.controls["detalle"].setValue(catalogoCategoria);*/
  };

  capturarPersona = () => {
    console.log("entra a capturar");
    let params: ParameterContribuyente[] = [];
    this.contribuyentesCompleto.forEach((element) => {
      if (element.idtipopersona === this.opcionSeleccionado.id) {
        let e: ParameterContribuyente = new ParameterContribuyente(
          element.id,
          element.idtipopersona,
          element.name
        );
        console.log("cambia los contribuyentes", element);
        params.push(e);
      }
    });
    console.log("this.opcionSeleccionado.id", this.opcionSeleccionado.id);
    this.verSeleccion = this.opcionSeleccionado.id; // this.opcionSeleccionado.name;
    this.contribuyentes = params;
  };

  loadCombos = () => {
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
        this.contribuyentesCompleto = contribuyentes;
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
        console.log("this.catalogocategoriaseeee", this.catalogocategorias);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  /**
   * Se envía el formulario identificación
   *
   * @param value Valor del formulario
   */
  sendForm(value: any, valid: boolean) {
    this.submitted = true;
    if (valid) {
      this.spinner.show();
      console.log("this.identificacionFormffff", this.identificacionForm.value);
      this.formsService
        .saveIdentificacion(this.identificacionForm.value)
        .subscribe(
          (identificacionDto: IdentificacionDto) => {
            console.log("regresa Identificacion", identificacionDto);

            //this.processIDB.updatingIdentificacion(identificacionDto);

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
}
