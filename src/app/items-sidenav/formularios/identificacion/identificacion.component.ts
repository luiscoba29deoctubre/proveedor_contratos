import { IdentificacionDto } from "./../../../common/dtos/form/IdentificacionDto";
import { Component, OnInit } from "@angular/core";

import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";

import { Router } from "@angular/router";

import { NotificationService } from "../../../shared/services/notification.service";

import {
  Parameter,
  ParameterContribuyente,
  ParameterCode,
} from "../../../common/domain/param/parameters";

import { ProcessIDB } from "../../../shared/bd/process.indexedDB";
import { NgxIndexedDBService } from "ngx-indexed-db";

import { NgxSpinnerService } from "ngx-spinner";
import { FormularioService } from "../formulario.service";
import { listas } from "../../../shared/bd/indexedDB";
import { LoginService } from "../../../logueo/login/login.service";
import {
  ParameterActividad,
  ParameterCategoria,
  ParameterCatalogoCategoria,
} from "../../../common/domain/param/parameters";

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
  // listas de actividades
  actividades: ParameterCode[] = [];
  categorias: ParameterCode[] = [];
  catalogocategorias: ParameterCode[] = [];

  personaSeleccionado: Parameter;

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

    // anulamos para mostrar que deben de 'seleccionar value'
    this.personaSeleccionado = null;

    this.initForm();
    this.processIDB = new ProcessIDB(dbService); // creamos una instancia para manejar la base de datos
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

    this.formsService.getIdentificacion().subscribe(
      async (identificacionDto) => {
        // console.log(" llega allForms", identificacionDto);
        if (identificacionDto.estado) {
          console.log("componente ", identificacionDto);

          this.loadIdentificacion(identificacionDto); // carga los datos en pantalla
          await this.loadCombos(identificacionDto);
          this.setearCombosActividades(identificacionDto);
        }
        this.spinner.hide();
      },
      (error) => {
        console.log("aqui error hay ", error);
        this.spinner.hide();
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

  get getActividades(): FormArray {
    return this.identificacionForm.get("lstActividades") as FormArray;
  }

  removeActividad(i) {
    this.getActividades.removeAt(i);
  }

  loadIdentificacion = (i: IdentificacionDto) => {
    this.removeActividad(0);

    // cargamos con la informacion inicial al componente
    this.identificacionForm.controls["rucrise"].setValue(i.rucrise);
    this.identificacionForm.controls["nombrerazonsocial"].setValue(
      i.nombrerazonsocial
    );
    this.identificacionForm.controls["nombrecomercial"].setValue(
      i.nombrecomercial
    );
    // carga persona
    this.dbService.getAll(listas[0]).then(
      (personas) => {
        this.personas = personas;

        let persona: Parameter;
        this.personas.forEach((element) => {
          if (element.id === i.idtipopersona) {
            persona = element;

            this.identificacionForm.controls["persona"].setValue(persona);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
    // carga proveedor
    this.dbService.getAll(listas[1]).then(
      (proveedores) => {
        this.proveedores = proveedores;
        let proveedor: Parameter;
        this.proveedores.forEach((element) => {
          if (element.id === i.idtipoproveedor) {
            proveedor = element;

            this.identificacionForm.controls["proveedor"].setValue(proveedor);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
    // carga contribuyente
    this.dbService.getAll(listas[2]).then(
      (contribuyentes) => {
        this.contribuyentes = contribuyentes;
        this.contribuyentesCompleto = contribuyentes;

        let contribuyente: Parameter;
        this.contribuyentes.forEach((element) => {
          if (element.id === i.idtipocontribuyente) {
            contribuyente = element;

            this.identificacionForm.controls["contribuyente"].setValue(
              contribuyente
            );
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  };

  loadCombos = async (i: IdentificacionDto) => {
    const actividadNoUsada = await this.dbService.getAll(listas[3]).then(
      (actividades) => {
        this.actividades = actividades;
        console.log("actividades ddddd", actividades);
      },
      (error) => {
        console.log(error);
      }
    );

    //this.actividades[0]. = 1;

    console.log("loadCombos this.actividades", this.actividades);
    const categoriaNoUsada = await this.dbService.getAll(listas[4]).then(
      (categorias) => {
        this.categorias = categorias;
      },
      (error) => {
        console.log(error);
      }
    );
    console.log("loadCombos this.categorias", this.categorias);
    const catalogoCategoriaNoUsada = await this.dbService
      .getAll(listas[5])
      .then(
        (catalogoCategorias) => {
          this.catalogocategorias = catalogoCategorias;
        },
        (error) => {
          console.log(error);
        }
      );
    console.log("loadCombos this.catalogocategorias", this.catalogocategorias);
  };

  setearCombosActividades = async (i: IdentificacionDto) => {
    // carga la lista de actividades dinámicamente

    for (let k = 0; k < i.lstActividades.length; k++) {
      let actividad: ParameterActividad = new ParameterActividad();
      const tamanioActividades = this.actividades.length;

      for (let j = 0; j < tamanioActividades; j++) {
        if (this.actividades[j].code === i.lstActividades[k].idactividad) {
          actividad.id = i.lstActividades[k].id;
          actividad.code = i.lstActividades[k].idactividad;
          actividad.name = this.actividades[j].name;
          console.log("dentro de actividad", actividad);
          j = tamanioActividades;
        }
      }
      console.log("actividad xxx", actividad);

      let categoria: ParameterCategoria = new ParameterCategoria();
      const tamanioCategorias = this.categorias.length;

      for (let j = 0; j < tamanioCategorias; j++) {
        if (this.categorias[j].code === i.lstActividades[k].idcategoria) {
          categoria.id = i.lstActividades[k].id;
          categoria.code = i.lstActividades[k].idcategoria;
          categoria.name = this.categorias[j].name;
          console.log("dentro de categoria", categoria);

          j = tamanioCategorias;
        }
      }
      console.log("categoria", categoria);
      let catalogoCategoria: ParameterCategoria = new ParameterCategoria();
      const tamanioCatalogoCategorias = this.actividades.length;
      for (let j = 0; j < tamanioCatalogoCategorias; j++) {
        if (
          this.catalogocategorias[j].code ===
          i.lstActividades[k].idcatalogocategoria
        ) {
          catalogoCategoria.id = i.lstActividades[k].id;
          catalogoCategoria.code = i.lstActividades[k].idcatalogocategoria;
          catalogoCategoria.name = this.catalogocategorias[j].name;

          console.log("dentro de catalogoCategoria", catalogoCategoria);

          j = tamanioCatalogoCategorias;
        }
      }

      this.seteoActividad(actividad, categoria, catalogoCategoria);
    }
  };

  onSelect($event) {
    // You will get the target with bunch of other options as well.
    console.log("llegaa");
    console.log($event.target.value);
  }

  seteoActividad(actividad, categoria, catalogoCategoria) {
    this.getActividades.push(
      this.fb.group({
        actividad: [actividad, [Validators.required]],
        categoria: [categoria, [Validators.required]],
        detalle: [catalogoCategoria, [Validators.required]],
      })
    );
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

  capturarPersona = () => {
    console.log("entra a capturar");
    let params: ParameterContribuyente[] = [];
    this.contribuyentesCompleto.forEach((element) => {
      if (element.idtipopersona === this.personaSeleccionado.id) {
        let e: ParameterContribuyente = new ParameterContribuyente(
          element.id,
          element.idtipopersona,
          element.name
        );
        console.log("cambia los contribuyentes", element);
        params.push(e);
      }
    });
    console.log("this.opcionSeleccionado.id", this.personaSeleccionado.id);
    this.contribuyentes = params;
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

            this.router.navigate(["/infocontacto"]);

            this.showToasterSuccess();
            this.spinner.hide();
          },
          (error) => {
            this.loginService.checkToken(); // para que salga, cuando el token expire
            this.showToasterError();
            console.log(error);
            this.spinner.hide();
          }
        );
    }
  }
}
