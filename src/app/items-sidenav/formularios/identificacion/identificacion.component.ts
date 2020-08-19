import { IdentificacionDto } from "./../../../common/dtos/form/IdentificacionDto";
import { Component, OnInit } from "@angular/core";

import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";

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
    console.log("entra en formsServices");
    this.formsService.getIdentificacion().subscribe(
      (identificacionDto) => {
        // console.log(" llega allForms", identificacionDto);
        if (identificacionDto.estado) {
          console.log("componente ", identificacionDto);

          this.loadIdentificacion(identificacionDto); // carga los datos en pantalla
        }
        this.spinner.hide();
      },
      (error) => {
        console.log("aqui error hay ", error);
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

    i.lstActividades.forEach(async (e) => {
      console.log("dentro de foreach e", e);

      let actividad: Parameter;
      const actividadNoUsada = await this.dbService.getAll(listas[3]).then(
        (actividades) => {
          this.actividades = actividades;

          this.actividades.forEach((element) => {
            if (element.id === e.idactividad) {
              actividad = element;
              console.log("existe coincidencia actividad", actividad);

              const data = {
                lstActividades: [
                  {
                    actividad: { id: element.id, name: element.name },
                  },
                ],
              };
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );

      console.log("actividad seleccionado", actividad);

      let categoria: Parameter;
      const categoriaNoUsada = await this.dbService.getAll(listas[4]).then(
        (categorias) => {
          this.categorias = categorias;

          this.categorias.forEach((element) => {
            if (element.id === e.idcategoria) {
              categoria = element;
              console.log("existe coincidencia categoria", categoria);

              const data = {
                lstActividades: [
                  {
                    categoria: { id: element.id, name: element.name },
                  },
                ],
              };
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );

      console.log("categoria seleccionado", categoria);

      let catalogoCategoria: Parameter;
      const catalogoCategoriaNoUsada = await this.dbService
        .getAll(listas[5])
        .then(
          (catalogoCategorias) => {
            this.catalogocategorias = catalogoCategorias;

            this.catalogocategorias.forEach((element) => {
              if (element.id === e.idcatalogocategoria) {
                catalogoCategoria = element;
                console.log(
                  "existe coincidencia catalogoCategoria",
                  catalogoCategoria
                );

                const data = {
                  lstActividades: [
                    {
                      detalle: { id: element.id, name: element.name },
                    },
                  ],
                };
              }
            });
          },
          (error) => {
            console.log(error);
          }
        );

      console.log("catalogoCategoria seleccionado", catalogoCategoria);

      this.loadNewActividad(actividad, categoria, catalogoCategoria);
    });
  };

  loadNewActividad(
    actividad: Parameter,
    categoria: Parameter,
    catalogoCategoria: Parameter
  ) {
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
        actividad: ["", [Validators.required]],
        categoria: ["", [Validators.required]],
        detalle: ["", [Validators.required]],
      })
    );
  }

  capturarPersona = () => {
    const data = {
      lstActividades: [
        {
          detalle: { id: 0, name: "AIRES ACONDICIONADOS" },
        },
      ],
    };
    this.identificacionForm.patchValue(data);

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
            this.showToasterError();
            console.log(error);
            this.spinner.hide();
          }
        );
    }
  }
}
