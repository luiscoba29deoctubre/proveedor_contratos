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
  ParamParroquia,
  ParamProvincia,
} from "../../../common/dtos/parameters";
import { LoginService } from "../../../logueo/login/login.service";
import { storageList } from "../../../shared/bd/indexedDB";
import { ProcessIDB } from "../../../shared/bd/process.indexedDB";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "./../formulario.service";

export class Technology {
  constructor(
    public techId: number,
    public id: number,
    public techName: string
  ) {}
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
  /** Objeto processIDB para llenar todos los datos del usuario */
  processIDB: ProcessIDB;

  paises: Parameter[] = [];

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
    //  this.processIDB = new ProcessIDB(dbService); // creamos una instancia para manejar la base de datos
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

        if (this.isEmpty(infoContactoDto)) {
          this.setDefaultValuesCombos(infoContactoDto);
        } else {
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
        //     console.log("paises", paises);
        this.paises = paises;
        this.parroquiasCompleto = paises;
      },
      (error) => {
        console.log(error);
      }
    );
    const provinciaNoUsada = await this.dbService.getAll(storageList[7]).then(
      (provincias) => {
        this.provincias = provincias;
        this.provinciasCompleto = provincias;
        //   console.log("provincias", provincias);
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
      pais: [null],
      provincia: [null],
      canton: [null],
      parroquia: [null],
    });
  }

  loadInfoContacto = (i: InfoContactoDto) => {
    // cargamos con la informacion inicial al componente
    this.infocontactoForm.controls["direccion"].setValue(i.direccion);
    this.infocontactoForm.controls["telefono"].setValue(i.telefono);
    this.infocontactoForm.controls["celular"].setValue(i.celular);
    this.infocontactoForm.controls["mailproveedor"].setValue(i.mailproveedor);
    this.infocontactoForm.controls["contactocomercial"].setValue(
      i.contactocomercial
    );
    this.infocontactoForm.controls["telefonocontactocomercial"].setValue(
      i.telefonocontactocomercial
    );
    this.infocontactoForm.controls["celular1"].setValue(i.celular1);
    this.infocontactoForm.controls["mail1"].setValue(i.mail1);
    this.infocontactoForm.controls["celular2"].setValue(i.celular2);
    this.infocontactoForm.controls["mail2"].setValue(i.mail2);
  };

  capturaPais = (pais: Parameter) => {
    console.log("pais", pais);
    if (pais) {
      const newProvincias: ParamProvincia[] = [];
      this.provinciasCompleto.forEach((provincia) => {
        console.log(provincia);
        if (provincia.idpais === pais.id) {
          const pro: ParamProvincia = new ParamProvincia(
            provincia.id,
            provincia.idpais,
            provincia.name
          );
          newProvincias.push(pro);
        }
      });
      console.log("newProvincias", newProvincias);
      this.provincias = newProvincias;

      // estar pendiente que en este metodo se puede crear
      // otro que se llame capturarProvincia
      // y dentro de capturarProvincia deberia ir el metodo
      // capturarCanton
      // y dentro de ese metodo debe ir el de
      // capturarParroquia
      // para hacer las cargas de los combos

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
    console.log("provincia", provincia);
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
      console.log("newCantones", newCantones);
      this.cantones = newCantones;

      this.capturaCanton(newCantones[0]);

      this.infocontactoForm.controls["canton"].setValue(null);
      this.infocontactoForm.controls["parroquia"].setValue(null);
    }
  };

  capturaCanton = (canton: ParamCanton) => {
    console.log("canton", canton);
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
      console.log("newParroquias", newParroquias);
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
          console.log("infoContactoDtoddd", infoContactoDto);
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
