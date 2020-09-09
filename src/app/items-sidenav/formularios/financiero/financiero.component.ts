import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import { FinancieroDto } from "../../../common/dtos/form/FinancieroDto";
import { LoginService } from "../../../logueo/login/login.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "../formulario.service";
import { MatDialog } from "@angular/material";
import { DialogBoxComponent } from "./dialog-box/dialog-box.component";
import { ParamPerfilFinanciero } from "../../../common/dtos/parameters";

@Component({
  selector: "app-financiero",
  templateUrl: "./financiero.component.html",
  styleUrls: ["./financiero.component.css"],
})
export class FinancieroComponent implements OnInit {
  //  displayedColumns: string[] = [ "Cuenta", "weight", "symbol"];
  displayedColumns: string[] = ["cuenta", "resultado", "resultado2", "action"];
  dataSource;

  submitted: boolean;

  naturalForm: FormGroup;
  juridicoForm: FormGroup;

  currentYear;

  tipoPersona: string;

  lstCuentas: ParamPerfilFinanciero[] = [];

  dataParameters: any[] = [];

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private notifyService: NotificationService,
    private formsService: FormularioService,
    private dbService: NgxIndexedDBService
  ) {
    this.spinner.show();
    this.initNaturalForm();
    this.initJuridicoForm();
  }

  ngOnInit() {
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

    // this.dataSource = this.lstCuentas;
    this.dataParameters = this.lstCuentas;

    this.dataSource = this.dataParameters;

    console.log("this.lstCuentas", this.lstCuentas);

    this.loginService.checkExpirationToken(); // para que salga, cuando el token expire

    this.formsService.getFinanciero().subscribe(
      async (financieroDto: FinancieroDto) => {
        console.log("llega allForms", financieroDto.anioActual);

        this.currentYear = financieroDto.anioActual;
        this.tipoPersona = financieroDto.tipoPersona;

        console.log("this.tipoPersona", this.tipoPersona);

        this.esNatural();
        this.esJuridico();

        this.spinner.hide();
      },
      (error) => {
        console.log("aqui error hay ", error);
        this.spinner.hide();
      }
    );
  }

  openDialog(action: string, obj:any) {
    console.log("action", action);
    console.log("obj", obj);

    obj.anio = this.currentYear;

    console.log("new obj", obj);
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "250px",
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "Actualizar") {
        this.updateRowData(result.data);
      }
      this.dataParameters = this.lstCuentas;
      //  this.enviarDataParameterOnServer();
      this.dataSource = this.dataParameters;
    });
  }

  updateRowData(row_obj: ParamPerfilFinanciero) {
    console.log("row_objvvvv", row_obj);

    // comprobaciòn para ver si ya existe el codigo
    const foundElement = this.dataParameters.find(
      (element) => row_obj.id === element.id
    );

    if (foundElement) {
      // se muestra mensaje de advertencia
      this.showToasterError();
    } else {
      let id_row: number;
      for (let i = 0; i < this.dataParameters.length; i++) {
        if (this.dataParameters[i].id === row_obj.id) {
          id_row = row_obj.id;
          break;
        }
      }
      this.dataParameters = this.dataParameters.filter((value, key) => {
        return value.id !== row_obj.id;
      });
      this.dataParameters.push({
        id: id_row,
        code: row_obj.id,
        name: row_obj.resultadoPenultimo,
      });
    }
  }

  guardar() {
    console.log("this.lstCuentas", this.lstCuentas);
  }

  showToasterSuccess() {
    this.notifyService.showSuccess("guardada exitosamente", "Financiero");
  }

  showToasterError() {
    this.notifyService.showError("Error al guardar perfil financiero", "Error");
  }

  private initNaturalForm() {
    this.naturalForm = this.fb.group({
      lstNatural: this.fb.array([
        this.fb.group({
          cuentaPenultimo: [null, [Validators.required]],
          cuentaUltimo: [null, [Validators.required]],
        }),
      ]),
    });
  }

  private initJuridicoForm() {
    this.juridicoForm = this.fb.group({
      pasivoUltimo: [null, [Validators.required]],
      pasivoPenultimo: [null, [Validators.required]],
      patrimonioPenultimo: [null, [Validators.required]],
      patrimonioUltimo: [null, [Validators.required]],
      activoPenultimo: [null, [Validators.required]],
      activoUltimo: [null, [Validators.required]],
      activoCorrientePenultimo: [null, [Validators.required]],
      activoCorrienteUltimo: [null, [Validators.required]],
      pasivoCorrientePenultimo: [null, [Validators.required]],
      pasivoCorrienteUltimo: [null, [Validators.required]],
      utilidadNetaPenultimo: [null, [Validators.required]],
      utilidadNetaUltimo: [null, [Validators.required]],
    });
  }

  get getLstNatural(): FormArray {
    return this.naturalForm.get("lstNatural") as FormArray;
  }

  esNatural = () => {
    if (this.tipoPersona === "Natural") {
      return false;
    } else {
      return true;
    }
  };

  esJuridico = () => {
    if (this.tipoPersona === "Juridico") {
      return false;
    } else {
      return true;
    }
  };

  sendNaturalForm(value: any, valid: boolean) {
    this.submitted = true;

    console.log("this.naturalForm.value", this.naturalForm.value);

    this.spinner.show();
    this.formsService.saveFinancieroNatural(this.naturalForm.value).subscribe(
      (financieroDto: FinancieroDto) => {
        console.log("llega FinancieroDto ", financieroDto);
        this.router.navigate(["/operativo"]);

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

  retrocederForm() {
    this.router.navigate(["/empresarial"]);
  }

  sendJuridicoForm(value: any, valid: boolean) {
    this.submitted = true;

    this.spinner.show();
    this.formsService.saveFinancieroJuridico(this.juridicoForm.value).subscribe(
      (financieroDto: FinancieroDto) => {
        console.log("llega FinancieroDto ", FinancieroDto);
        this.router.navigate(["/operativo"]);

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
