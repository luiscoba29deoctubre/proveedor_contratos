import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import { IdentificacionDto } from "../../../common/dtos/form/IdentificacionDto";
import { InfoContactoDto } from "../../../common/dtos/form/InfoContactoDto";
import {
  ParamCanton,
  ParamPais,
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

  paises: ParamPais[] = [];

  paisSeleccionado: ParamPais;

  provincias: ParamProvincia[] = [];
  provinciasCompleto: ParamProvincia[] = [];
  provinciaSeleccionado: ParamProvincia;

  cantones: ParamCanton[] = [];
  cantonesCompleto: ParamCanton[] = [];
  cantonSeleccionado: ParamCanton;

  parroquias: ParamParroquia[] = [];
  parroquiasCompleto: ParamParroquia[] = [];
  parroquiaSeleccionado: ParamParroquia;

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

    this.paisSeleccionado = null;
    this.provinciaSeleccionado = null;
    this.cantonSeleccionado = null;
    this.parroquiaSeleccionado = null;
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
      (infoContactoDto) => {
        console.log(" llega allForms", infoContactoDto);

        if (this.isEmpty(infoContactoDto)) {
          this.setDefaultValuesCombos(infoContactoDto);
        } else {
          this.seteoFormulario(infoContactoDto);

          console.log(
            "this.infocontactoForm.value",
            this.infocontactoForm.value
          );
        }
        this.spinner.hide();
      },
      (error) => {
        console.log("aqui error hay ", error);
        this.spinner.hide();
      }
    );
  }

  seteoFormulario(i: InfoContactoDto) {
    console.log("entra en seteoFormulario");
    i.pais = this.paises[0];

    this.paisSeleccionado = this.paises[0];

    this.provincias = this.provinciasCompleto.filter(
      (provincia) => provincia.idpais === i.pais.id
    );

    this.provinciaSeleccionado = this.provincias.find(
      (provincia) => provincia.id === i.provincia.id
    );

    this.cantones = this.cantonesCompleto.filter(
      (canton) => canton.idprovincia === i.canton.idprovincia
    );

    this.cantonSeleccionado = this.cantones.find(
      (canton) => canton.id === i.canton.id
    );

    this.parroquias = this.parroquiasCompleto.filter(
      (parroquia) => parroquia.idcanton === i.parroquia.idcanton
    );

    this.parroquiaSeleccionado = this.parroquias.find(
      (parroquia) => parroquia.id === i.parroquia.id
    );

    this.infocontactoForm.controls["direccion"].setValue(i.direccion);
    this.infocontactoForm.controls["celular"].setValue(i.celular);
    this.infocontactoForm.controls["telefono"].setValue(i.telefono);
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
        this.provinciasCompleto = provincias;
      },
      (error) => {
        console.log(error);
      }
    );
    const cantonNoUsada = await this.dbService.getAll(storageList[8]).then(
      (cantones) => {
        this.cantonesCompleto = cantones;
      },
      (error) => {
        console.log(error);
      }
    );
    const parroquiaNoUsada = await this.dbService.getAll(storageList[9]).then(
      (parroquias) => {
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

  capturaPais = () => {
    if (this.paisSeleccionado) {
      this.provincias = this.provinciasCompleto.filter(
        (provincia) => provincia.idpais === this.paisSeleccionado.id
      );

      this.capturaProvincia();

      this.infocontactoForm.controls["provincia"].setValue(null);
      this.infocontactoForm.controls["canton"].setValue(null);
      this.infocontactoForm.controls["parroquia"].setValue(null);
    }
  };

  capturaProvincia = () => {
    console.log("provincia", this.provinciaSeleccionado);
    if (this.provinciaSeleccionado) {
      this.cantones = this.cantonesCompleto.filter(
        (canton) => canton.idprovincia === this.provinciaSeleccionado.id
      );

      this.capturaCanton();

      this.infocontactoForm.controls["canton"].setValue(null);
      this.infocontactoForm.controls["parroquia"].setValue(null);
    }
  };

  capturaCanton = () => {
    console.log("capturaCanton canton", this.cantonSeleccionado);
    if (this.cantonSeleccionado) {
      this.parroquias = this.parroquiasCompleto.filter(
        (parroquia) => parroquia.idcanton === this.cantonSeleccionado.id
      );
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
