import { IdentificacionDto } from "./../../../common/dtos/form/IdentificacionDto";
import { Component, OnInit } from "@angular/core";

import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";

import { Router } from "@angular/router";

import { NotificationService } from "../../../shared/services/notification.service";

import { ProcessIDB } from "../../../shared/bd/process.indexedDB";
import { NgxIndexedDBService } from "ngx-indexed-db";

import { NgxSpinnerService } from "ngx-spinner";
import { FormularioService } from "../formulario.service";
import { storageList } from "../../../shared/bd/indexedDB";
import { LoginService } from "../../../logueo/login/login.service";
import { ParamService } from '../../../dashboard/param.service';

import {
  Parameter,
  ParamContribuyente,
  ParamCategoria,
  ParamCatalogoCategoria,
} from "../../../common/dtos/parameters";

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

  proveedores: Parameter[];

  personas: Parameter[];
  contribuyentesPorPersona: ParamContribuyente[] = [];
  contribuyentesCompleto: ParamContribuyente[];

  actividades: Parameter[] = [];
  categoriasCompleto: ParamCategoria[] = [];
  catalogocategoriasCompleto: ParamCatalogoCategoria[] = [];

  catalogocategoriasPorCategoria: ParamCatalogoCategoria[] = [];
  categoriasPorActividad: ParamCategoria[] = [];

  catalogocategoriasPorCategoriaPadre: ParamCatalogoCategoria[][] = [];
  categoriasPorActividadPadre: ParamCategoria[][] = [];

  personaSeleccionado: Parameter;

  categoriaSeleccionada: ParamCategoria[] = [];
  actividadSeleccionada: Parameter[] = [];
  catalogocategoriaSeleccionada: ParamCatalogoCategoria[] = [];

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
    private paramService: ParamService,
    private spinner: NgxSpinnerService,
    private formsService: FormularioService,
    private notifyService: NotificationService,
    private dbService: NgxIndexedDBService,
    private loginService: LoginService
  ) {
    this.spinner.show();

    this.personaSeleccionado = null;

    this.actividadSeleccionada.push(null);
    this.categoriaSeleccionada.push(null);
    this.catalogocategoriaSeleccionada.push(null);

    this.initForm();
    // creamos una instancia para manejar la base de datos
    this.processIDB = new ProcessIDB(dbService);

    this.processIDB.clearIndexedDB(); // para borrar los stores del indexedDB

    this.paramService.getParameters().subscribe(
      (allParameters) => {
        console.log("allParameterssssssssss", allParameters);
        // llenamos la base 'indexed-db'
        this.processIDB.fillingParameters(allParameters);
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
    this.spinner.show();
    this.loginService.checkExpirationToken(); // para que salga, cuando el token expire

    this.formsService.getIdentificacion().subscribe(
      async (identificacionDto) => {
        console.log("llega allForms", identificacionDto);

        await this.loadProveedor();
        await this.loadPersonaContribuyente();
        await this.loadActividadesCompletas();

        if (this.isEmpty(identificacionDto)) {
          console.log("vacioooo");
        } else {
          // Object is NOT empty
          await this.setProveedor(identificacionDto);
          await this.setPersonaContribuyente(identificacionDto);
          this.setInicialContribuyentesPorPersona(identificacionDto);

          this.setIdentificacion(identificacionDto); // carga los datos en pantalla
          this.loadCombosActividades(identificacionDto);
          await this.setearCombosActividades(identificacionDto);
        }
        this.spinner.hide();
      },
      (error) => {
        console.log("aqui error hay ", error);
        this.spinner.hide();
      }
    );
  }

  isEmpty = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

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
          actividad: [null],
          categoria: [null],
          detalle: [null],
        }),
      ]),
    });
  }

  get getActividades(): FormArray {
    return this.identificacionForm.get("lstActividades") as FormArray;
  }

  removeActividad(i) {
    const id = this.getActividades.value[i].id;
    this.formsService.deleteActividad(id).subscribe(
      (data) => {
        console.log("llega data ", data);
      },
      (error) => {
        console.log(error);
      }
    );

    const newCategoriasPorActividadPadre = [];
    for (let k = 0; k < this.categoriasPorActividad.length; k++) {
      if (k !== i) {
        newCategoriasPorActividadPadre.push(this.categoriasPorActividad[k]);
      }
    }
    this.categoriasPorActividad = newCategoriasPorActividadPadre;

    const newCatalogocategoriasPorCategoriaPadre = [];
    for (let k = 0; k < this.catalogocategoriasPorCategoria.length; k++) {
      if (k !== i) {
        newCatalogocategoriasPorCategoriaPadre.push(
          this.catalogocategoriasPorCategoria[k]
        );
      }
    }
    this.catalogocategoriasPorCategoria = newCatalogocategoriasPorCategoriaPadre;
    this.getActividades.removeAt(i); // eliminamos visualmente del form
  }

  setIdentificacion = (i: IdentificacionDto) => {
    //  this.removeActividad(0);
    this.getActividades.removeAt(0);
    // cargamos con la informacion inicial al componente
    this.identificacionForm.controls["rucrise"].setValue(i.rucrise);
    this.identificacionForm.controls["nombrerazonsocial"].setValue(
      i.nombrerazonsocial
    );
    this.identificacionForm.controls["nombrecomercial"].setValue(
      i.nombrecomercial
    );
  };

  loadProveedor = async () => {
    // carga proveedor
    const proveedorNoUsado = await this.dbService.getAll(storageList[1]).then(
      (proveedores) => {
        this.proveedores = proveedores;
      },
      (error) => {
        console.log(error);
      }
    );
  };

  setProveedor = async (i: IdentificacionDto) => {
    // carga proveedor
    this.dbService.getAll(storageList[1]).then(
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
  };

  setInicialPersona = (i: IdentificacionDto) => {
    this.personas.forEach((persona) => {
      if (persona.id === i.idtipopersona) {
        this.identificacionForm.controls["persona"].setValue(persona);
      }
    });
  };

  setPersonaContribuyente = async (i: IdentificacionDto) => {
    await this.setInicialPersona(i);
    await this.cargarListaContribuyentesPorPersona(i);
  };

  loadPersonaContribuyente = async () => {
    await this.cargarListaPersonas();
    await this.cargarListaContribuyentesCompleta();
  };

  cargarListaPersonas = async () => {
    const personadNoUsada = await this.dbService.getAll(storageList[0]).then(
      (personas) => {
        this.personas = personas;
      },
      (error) => {
        console.log(error);
      }
    );
  };

  cargarListaContribuyentesCompleta = async () => {
    const contribuyenteNoUsado = await this.dbService
      .getAll(storageList[2])
      .then(
        (contribuyentes) => {
          this.contribuyentesCompleto = contribuyentes;
        },
        (error) => {
          console.log(error);
        }
      );
  };

  cargarListaContribuyentesPorPersona = (i: IdentificacionDto) => {
    this.contribuyentesCompleto.forEach((e) => {
      if (e.idtipopersona === i.idtipopersona) {
        this.contribuyentesPorPersona.push(e);
      }
    });
  };

  setInicialContribuyentesPorPersona = (i: IdentificacionDto) => {
    this.contribuyentesPorPersona.forEach((contribuyente) => {
      if (contribuyente.id === i.idtipocontribuyente) {
        this.identificacionForm.controls["contribuyente"].setValue(
          contribuyente
        );
      }
    });
  };

  loadActividadesCompletas = async () => {
    const actividadNoUsada = await this.dbService.getAll(storageList[3]).then(
      (actividades) => {
        this.actividades = actividades;
      },
      (error) => {
        console.log(error);
      }
    );
    const categoriaNoUsada = await this.dbService.getAll(storageList[4]).then(
      (categorias) => {
        this.categoriasPorActividad = categorias;
        this.categoriasCompleto = categorias;
      },
      (error) => {
        console.log(error);
      }
    );
    const catalogoCategoriaNoUsada = await this.dbService
      .getAll(storageList[5])
      .then(
        (catalogoCategorias) => {
          this.catalogocategoriasPorCategoria = catalogoCategorias;
          this.catalogocategoriasCompleto = catalogoCategorias;
        },
        (error) => {
          console.log(error);
        }
      );
  };

  loadCombosActividades = (i: IdentificacionDto) => {
    if (i.lstActividades) {
      for (let k = 0; k < i.lstActividades.length; k++) {
        /**************************************************************/

        // cargamos categoriasPorActividadPadre
        const paramscatcom: ParamCategoria[] = [];
        this.categoriasCompleto.forEach((catcom) => {
          if (catcom.idactividad === i.lstActividades[k].idactividad) {
            const c: ParamCategoria = new ParamCategoria(
              catcom.id,
              catcom.idactividad,
              catcom.name
            );
            paramscatcom.push(c);
          }
        });
        this.categoriasPorActividadPadre[k] = paramscatcom;

        /**************************************************************/

        // cargamos catalogoCategoriaPadre
        const paramscatcatcom: ParamCatalogoCategoria[] = [];
        this.catalogocategoriasCompleto.forEach((catcatcom) => {
          if (catcatcom.idcategoria === i.lstActividades[k].idcategoria) {
            const cc: ParamCatalogoCategoria = new ParamCatalogoCategoria(
              catcatcom.id,
              catcatcom.idcategoria,
              catcatcom.name
            );
            paramscatcatcom.push(cc);
          }
        });

        this.catalogocategoriasPorCategoriaPadre[k] = paramscatcatcom;
      }
    } else {
      this.addNewActividad();
    }
  };

  setearCombosActividades = async (i: IdentificacionDto) => {
    if (i.lstActividades) {
      for (let k = 0; k < i.lstActividades.length; k++) {
        let actividad: Parameter;
        const tamanioActividades = this.actividades.length;
        for (let j = 0; j < tamanioActividades; j++) {
          if (this.actividades[j].id === i.lstActividades[k].idactividad) {
            actividad = this.actividades[j];
            j = tamanioActividades;
          }
        }

        let categoria: ParamCategoria; // busqueda de la categoria
        this.categoriasPorActividadPadre[k].forEach(
          (categoriasPorActividad) => {
            if (categoriasPorActividad.id === i.lstActividades[k].idcategoria) {
              categoria = categoriasPorActividad;
            }
          }
        );

        let catalogoCategoria: ParamCatalogoCategoria; // busqueda de la categoria
        this.catalogocategoriasPorCategoriaPadre[k].forEach(
          (catalogocategoriasPorCategoria) => {
            if (
              catalogocategoriasPorCategoria.id ===
              i.lstActividades[k].idcatalogocategoria
            ) {
              catalogoCategoria = catalogocategoriasPorCategoria;
            }
          }
        );

        this.loadNewActividad(
          i.lstActividades[k].id,
          actividad,
          categoria,
          catalogoCategoria
        );
      }
    } else {
      this.addNewActividad();
    }
  };

  loadNewActividad(
    id: number,
    actividad: Parameter,
    categoria: ParamCategoria,
    catalogoCategoria: ParamCatalogoCategoria
  ) {
    this.getActividades.push(
      this.fb.group({
        id: [id],
        actividad: [actividad],
        categoria: [categoria],
        detalle: [catalogoCategoria],
      })
    );
  }

  addNewActividad() {
    const tamanioGetActividades = this.getActividades.length;
    this.getActividades.push(
      this.fb.group({
        actividad: [null],
        categoria: [null],
        detalle: [null],
      })
    );
    this.actividadSeleccionada[tamanioGetActividades] = null;
    this.categoriaSeleccionada[tamanioGetActividades] = null;
    this.catalogocategoriaSeleccionada[tamanioGetActividades] = null;
  }

  capturaActividad = (actividad: Parameter, i) => {
    const params: ParamCategoria[] = [];
    this.categoriasCompleto.forEach((categoria) => {
      if (categoria.idactividad === actividad.id) {
        const c: ParamCategoria = new ParamCategoria(
          categoria.id,
          categoria.idactividad,
          categoria.name
        );
        params.push(c);
      }
    });

    this.categoriasPorActividadPadre[i] = params;

    const params2: ParamCategoria[] = [];
    this.catalogocategoriasCompleto.forEach((catalogoCategoria) => {
      if (params[0].id === catalogoCategoria.idcategoria) {
        const cc: ParamCatalogoCategoria = new ParamCatalogoCategoria(
          catalogoCategoria.id,
          catalogoCategoria.idcategoria,
          catalogoCategoria.name
        );
        params2.push(cc);
      }
    });

    this.catalogocategoriasPorCategoriaPadre[i] = params2;
  };

  capturaCategoria = (categoria: ParamCategoria, i) => {
    const params: ParamCatalogoCategoria[] = [];
    this.catalogocategoriasCompleto.forEach((catalogoCategoria) => {
      if (catalogoCategoria.idcategoria === categoria.id) {
        const cc: ParamCatalogoCategoria = new ParamCatalogoCategoria(
          catalogoCategoria.id,
          catalogoCategoria.idcategoria,
          catalogoCategoria.name
        );
        params.push(cc);
      }
    });

    this.catalogocategoriasPorCategoriaPadre[i] = params;
  };

  capturaPersona = () => {
    const params: ParamContribuyente[] = [];
    this.contribuyentesCompleto.forEach((element) => {
      if (element.idtipopersona === this.personaSeleccionado.id) {
        const e: ParamContribuyente = new ParamContribuyente(
          element.id,
          element.idtipopersona,
          element.name
        );
        params.push(e);
      }
    });
    this.contribuyentesPorPersona = params;
    this.identificacionForm.controls["contribuyente"].setValue(null);
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
      this.formsService
        .saveIdentificacion(this.identificacionForm.value)
        .subscribe(
          (identificacionDto: IdentificacionDto) => {
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
