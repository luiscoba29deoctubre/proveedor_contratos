import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import { IdentificacionDto } from "../../../common/dtos/form/IdentificacionDto";
import { InfoContactoDto } from "../../../common/dtos/form/InfoContactoDto";
import {
  ParamCanton,
  Parameter,
  ParamPais,
  ParamParroquia,
  ParamProvincia,
} from "../../../common/dtos/parameters";
import { LoginService } from "../../../logueo/login/login.service";
import { storageList } from "../../../shared/bd/indexedDB";
import { ProcessIDB } from "../../../shared/bd/process.indexedDB";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "./../formulario.service";

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
  /** Objeto processIDB para llenar todos los datos del usuario */
  processIDB: ProcessIDB;

  paises: ParamPais[] = [];

  provincias: ParamProvincia[] = [];
  provinciasCompleto: ParamProvincia[] = [];

  cantones: ParamCanton[] = [];
  cantonesCompleto: ParamCanton[] = [];

  parroquias: ParamParroquia[] = [];
  parroquiasCompleto: ParamParroquia[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private notifyService: NotificationService,
    private formsService: FormularioService,
    private dbService: NgxIndexedDBService
  ) {
    this.spinner.show();
    this.initForm();
  }

  // sacado de https://morioh.com/p/526559a86600 el Toast que muestra mensajes
  showToasterSuccess() {
    this.notifyService.showSuccess("guardada exitosamente", "Identificación");
  }

  showToasterError() {
    this.notifyService.showError("Error al guardar identificación", "Error");
  }

  async ngOnInit(): Promise<void> {
    this.loginService.checkExpirationToken(); // para que salga, cuando el token expire

    await this.loadCombos();

    this.formsService.getInfoContacto().subscribe(
      async (infoContactoDto) => {
        console.log(" llega allForms", infoContactoDto);
        // setear por default el pais
        infoContactoDto.pais = this.paises[0]; // a fuerza bruta poner el pais, antes q solo es 1 jeje

        if (this.isEmpty(infoContactoDto)) {
          this.setDefaultValuesCombos(infoContactoDto);
        } else {
          console.log("hace el seteo");
          this.infocontactoForm.setValue(infoContactoDto);
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

  setDefaultValuesCombos = (i) => {
    i.pais = null;
    i.provincia = null;
    i.canton = null;
    i.parroquia = null;
    this.infocontactoForm.patchValue(i);
  };

  loadCombos = async () => {
    const paisNoUsada = await this.dbService.getAll(storageList[6]).then(
      (paises) => {
        this.paises = paises;
      },
      (error) => {
        console.log(error);
      }
    );
    const provinciaNoUsada = await this.dbService.getAll(storageList[7]).then(
      (provincias) => {
        this.provincias = provincias;
        this.provinciasCompleto = provincias;
      },
      (error) => {
        console.log(error);
      }
    );
    const cantonNoUsada = await this.dbService.getAll(storageList[8]).then(
      (cantones) => {
        this.cantones = cantones;
        this.cantonesCompleto = cantones;
      },
      (error) => {
        console.log(error);
      }
    );
    const parroquiaNoUsada = await this.dbService.getAll(storageList[9]).then(
      (parroquias) => {
        this.parroquias = parroquias;
        this.parroquiasCompleto = parroquias;
      },
      (error) => {
        console.log(error);
      }
    );
  };

  private initForm() {
    this.infocontactoForm = this.fb.group({
      direccion: [null, [Validators.required]],
      telefono: [null, [Validators.required]],
      celular: [null, [Validators.required]],
      mailproveedor: [null, [Validators.required]],
      contactocomercial: [null, [Validators.required]],
      telefonocontactocomercial: [null, [Validators.required]],
      celular1: [null, [Validators.required]],
      mail1: [null, [Validators.required]],
      celular2: [null, [Validators.required]],
      mail2: [null, [Validators.required]],
      pais: [null, [Validators.required]],
      provincia: [null, [Validators.required]],
      canton: [null, [Validators.required]],
      parroquia: [null, [Validators.required]],
    });
  }

  capturaPais = (pais: Parameter) => {
    if (pais) {
      const newProvincias: ParamProvincia[] = [];
      this.provinciasCompleto.forEach((provincia) => {
        if (provincia.idpais === pais.id) {
          const pro: ParamProvincia = new ParamProvincia(
            provincia.id,
            provincia.idpais,
            provincia.name
          );
          newProvincias.push(pro);
        }
      });

      this.provincias = newProvincias;

      const newCantones: ParamCanton[] = [];
      this.cantonesCompleto.forEach((canton: ParamCanton) => {
        if (newProvincias[0].id === canton.idprovincia) {
          const cc: ParamCanton = new ParamCanton(
            canton.id,
            canton.idprovincia,
            canton.name
          );
          newCantones.push(cc);
        }
      });
      this.cantones = newCantones;

      const newParroquas: ParamParroquia[] = [];
      this.parroquiasCompleto.forEach((parroquia) => {
        if (newCantones[0].id === parroquia.idcanton) {
          const cc: ParamParroquia = new ParamParroquia(
            parroquia.id,
            parroquia.idcanton,
            parroquia.name
          );
          newParroquas.push(cc);
        }
      });

      this.parroquias = newParroquas;

      this.infocontactoForm.controls["provincia"].setValue(null);
      this.infocontactoForm.controls["canton"].setValue(null);
      this.infocontactoForm.controls["parroquia"].setValue(null);
    }
  };

  capturaProvincia = (provincia: ParamCanton) => {
    if (provincia) {
      const newCantones: ParamCanton[] = [];
      this.cantonesCompleto.forEach((canton) => {
        if (canton.idprovincia === provincia.id) {
          const cant: ParamCanton = new ParamCanton(
            canton.id,
            canton.idprovincia,
            canton.name
          );
          newCantones.push(cant);
        }
      });

      this.cantones = newCantones;

      this.capturaCanton(newCantones[0]);

      this.infocontactoForm.controls["canton"].setValue(null);
      this.infocontactoForm.controls["parroquia"].setValue(null);
    }
  };

  capturaCanton = (canton: ParamCanton) => {
    if (canton) {
      const newParroquias: ParamParroquia[] = [];
      this.parroquiasCompleto.forEach((parroquia) => {
        if (parroquia.idcanton === canton.id) {
          const parroq: ParamParroquia = new ParamParroquia(
            parroquia.id,
            parroquia.idcanton,
            parroquia.name
          );
          newParroquias.push(parroq);
        }
      });

      this.parroquias = newParroquias;

      this.infocontactoForm.controls["parroquia"].setValue(null);
    }
  };

  /**
   * Se envía el formulario info-contacto
   *
   * @param value Valor del formulario
   */
  sendForm(value: any, valid: boolean) {
    this.submitted = true;
    if (valid) {
      this.spinner.show();
      this.formsService.saveInfoContacto(this.infocontactoForm.value).subscribe(
        (infoContactoDto: InfoContactoDto) => {
          console.log("infoContactoDto", infoContactoDto);
          this.router.navigate(["/empresarial"]);

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

  retrocederForm() {
    this.router.navigate(["/identificacion"]);
  }
}
