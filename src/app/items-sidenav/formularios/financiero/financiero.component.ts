import { Component, OnInit } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { FinancieroDto } from "../../../common/dtos/form/FinancieroDto";
import {
  ParamCuenta,
  ParamPerfilFinanciero,
} from "../../../common/dtos/parameters";
import { LoginService } from "../../../logueo/login/login.service";
import { storageList } from "../../../shared/bd/indexedDB";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "../formulario.service";
import { DialogBoxComponent } from "./dialog-box/dialog-box.component";

@Component({
  selector: "app-financiero",
  templateUrl: "./financiero.component.html",
  styleUrls: ["./financiero.component.css"],
})
export class FinancieroComponent implements OnInit {
  displayedColumns: string[] = ["cuenta", "resultado2", "action"];
  dataSource;

  submitted: boolean;

  naturalForm: FormGroup;
  juridicoForm: FormGroup;

  currentYear;

  tipoPersona: string;
  idTipoPersona;

  lstCuentas: ParamPerfilFinanciero[] = [];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private dbService: NgxIndexedDBService,
    private notifyService: NotificationService,
    private formsService: FormularioService
  ) {
    this.spinner.show();
  }

  ngOnInit() {
    this.loginService.checkExpirationToken(); // para que salga, cuando el token expire

    this.formsService.getFinanciero().subscribe(
      async (response) => {
        const financieroDto: FinancieroDto = response.body;

        console.log("llega financieroDto", financieroDto);

        this.currentYear = financieroDto.anioActual;

        if (financieroDto.tipoPersona) {
          this.tipoPersona = financieroDto.tipoPersona.toUpperCase();
          console.log("this.tipoPersona", this.tipoPersona);
          this.idTipoPersona = financieroDto.idTipoPersona;
          await this.loadCuentas();

          if (financieroDto.lstCuentas.length > 0) {
            console.log("entra en if");
            this.setCuentas(financieroDto.lstCuentas);
          }
        } else {
          this.spinner.hide();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debe elegir 'tipo Persona' en identificación",
          });
        }

        this.spinner.hide();
      },
      (error) => {
        console.log("aqui error hay ", error);
        this.spinner.hide();
      }
    );
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
    obj.anio = this.currentYear;

    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "250px",
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event === "Actualizar") {
          this.updateRowData(result.data);
        }
      }
    });
  }

  updateRowData(row_obj: ParamPerfilFinanciero) {
    const longitudCuenta = this.lstCuentas.length;
    for (let i = 0; i < longitudCuenta; i++) {
      if (this.lstCuentas[i].idcuenta === row_obj.idcuenta) {
        this.lstCuentas[i].resultadoPenultimo = row_obj.resultadoPenultimo;
        this.lstCuentas[i].resultadoUltimo = row_obj.resultadoUltimo;

        this.actualizaCuentaOnServer(this.lstCuentas[i]);
      }
    }
  }

  actualizaCuentaOnServer(cuentaAactualizar: ParamPerfilFinanciero) {
    console.log("cuentaAactualizar", cuentaAactualizar);
    this.loginService.checkExpirationToken();
    this.formsService.actualizarPerfilFinanciero(cuentaAactualizar).subscribe(
      (financieroDto: FinancieroDto) => {
        console.log("llega FinancieroDto ", financieroDto);
        // this.router.navigate(["/operativo"]);

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

  showToasterSuccess() {
    this.notifyService.showSuccess("guardada exitosamente", "Financiero");
  }

  showToasterError() {
    this.notifyService.showError("Tiene algun valor igual a cero", "Error");
  }

  get getLstNatural(): FormArray {
    return this.naturalForm.get("lstNatural") as FormArray;
  }

  setCuentas = async (lstCuentas: ParamPerfilFinanciero[]) => {
    for (let i = 0; i < this.lstCuentas.length; i++) {
      const elementFound = lstCuentas.find(
        (c) => c.idcuenta === this.lstCuentas[i].idcuenta
      );
      if (elementFound) {
        this.lstCuentas[i].resultadoPenultimo = elementFound.resultadoPenultimo;
        this.lstCuentas[i].resultadoUltimo = elementFound.resultadoUltimo;
      }
    }

    this.dataSource = this.lstCuentas;
    console.log("this.lstCuentas setCuentas", this.lstCuentas);
  };

  loadCuentas = async () => {
    const cuentasNoUsada = await this.dbService
      .getAllByIndex(storageList[13], "idtipopersona", this.idTipoPersona)
      .then(
        (cuentas) => {
          console.log("cuentas", cuentas);

          this.lstCuentas = [];
          cuentas.forEach((pc: ParamCuenta) => {
            const cuenta = new ParamPerfilFinanciero();

            cuenta.idcuenta = pc.id;
            cuenta.cuenta = pc.name;

            cuenta.resultadoPenultimo = 0;
            cuenta.resultadoUltimo = 0;

            this.lstCuentas.push(cuenta);
          });

          this.dataSource = this.lstCuentas;
        },
        (error) => {
          console.log("getByIndex", error);
        }
      );
  };

  retrocederForm() {
    this.router.navigate(["/empresarial"]);
  }

  siguienteForm() {
    let faltanDatos = false;

    this.lstCuentas.forEach((cuenta) => {
      if (cuenta.resultadoUltimo === 0) {
        faltanDatos = true;
      }
    });

    if (faltanDatos) {
      this.showToasterError();
    } else {
      this.showToasterSuccess();
      this.router.navigate(["/operativo"]);
    }
  }
}
