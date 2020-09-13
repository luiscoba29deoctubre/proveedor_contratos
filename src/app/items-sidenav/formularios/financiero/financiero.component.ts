import { Component, OnInit } from "@angular/core";
import { FormArray, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import { FinancieroDto } from "../../../common/dtos/form/FinancieroDto";
import {
  ParamPerfilFinanciero,
  ParamCuenta,
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
  displayedColumns: string[] = ["cuenta", "resultado", "resultado2", "action"];
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
    /*
    const cuenta1: ParamPerfilFinanciero = new ParamPerfilFinanciero();
    cuenta1.id = 3;
    cuenta1.cuenta = "ingresos";
    cuenta1.resultadoUltimo = 1200;
    cuenta1.resultadoPenultimo = 3000;
    const cuenta2: ParamPerfilFinanciero = new ParamPerfilFinanciero();
    cuenta2.id = 2;
    cuenta2.cuenta = "gastos";
    cuenta2.resultadoUltimo = 4;
    cuenta2.resultadoPenultimo = 7;

    this.lstCuentas.push(cuenta1);
    this.lstCuentas.push(cuenta2);

    this.dataSource = this.lstCuentas;
    */

    this.loginService.checkExpirationToken(); // para que salga, cuando el token expire

    this.formsService.getFinanciero().subscribe(
      async (financieroDto: FinancieroDto) => {
        console.log("llega financieroDto", financieroDto);

        this.currentYear = financieroDto.anioActual;
        this.tipoPersona = financieroDto.tipoPersona.toUpperCase();

        console.log("this.tipoPersona", this.tipoPersona);

        if (this.tipoPersona) {
          this.idTipoPersona = financieroDto.idTipoPersona;
          this.loadCuentas();
        } else {
          this.showToasterError();
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
          console.log("result.data", result.data);

          this.updateRowData(result.data);
        }
      }
    });
  }

  updateRowData(row_obj: ParamPerfilFinanciero) {
    console.log("row_objxxx", row_obj);
    const longitudCuenta = this.lstCuentas.length;
    for (let i = 0; i < longitudCuenta; i++) {
      if (this.lstCuentas[i].idcuenta === row_obj.idcuenta) {
        console.log("despues this.lstCuentas[i]", this.lstCuentas[i]);

        this.actualizaCuentaOnServer(this.lstCuentas[i]);
      }
    }
  }

  actualizaCuentaOnServer(cuentaAactualizar: ParamPerfilFinanciero) {
    this.loginService.checkExpirationToken();
    console.log("cuentaAactualizar xxx", cuentaAactualizar);
    this.formsService.actualizarPerfilFinanciero(cuentaAactualizar).subscribe(
      (financieroDto: FinancieroDto) => {
        console.log("llega FinancieroDto ", FinancieroDto);
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
    this.notifyService.showError(
      "Aún no llena la sección de Identificacion",
      "Error"
    );
  }

  get getLstNatural(): FormArray {
    return this.naturalForm.get("lstNatural") as FormArray;
  }

  loadCuentas = async () => {
    const cuentasNoUsada = await this.dbService
      .getAllByIndex(storageList[13], "idtipopersona", this.idTipoPersona)
      .then(
        (cuentas) => {
          console.log("cuentas", cuentas);

          this.lstCuentas = [];
          cuentas.forEach((element: ParamCuenta) => {
            const cuenta = new ParamPerfilFinanciero();

            cuenta.idcuenta = element.id;
            cuenta.cuenta = element.name;

            cuenta.resultadoPenultimo = 0;
            cuenta.resultadoUltimo = 0;

            this.lstCuentas.push(cuenta);
          });

          this.dataSource = this.lstCuentas;
          console.log("this.lstCuentas", this.lstCuentas);
        },
        (error) => {
          console.log("getByIndex", error);
        }
      );
  };

  retrocederForm() {
    this.router.navigate(["/operativo"]);
  }
}
