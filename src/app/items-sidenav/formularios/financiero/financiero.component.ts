import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import { FinancieroDto } from "../../../common/dtos/form/FinancieroDto";
import { LoginService } from "../../../logueo/login/login.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "../formulario.service";

export class Cuenta {
  constructor(
    public id?: number,
    public nombre?: string,
    public anioUltimo?: number,
    public anioPenultimo?: number
  ) {}
}

export interface PeriodicElement {
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {  name: "Hydrogen", weight: 1.0079, symbol: "H" },
  {  name: "Helium", weight: 4.0026, symbol: "He" },
  {  name: "Lithium", weight: 6.941, symbol: "Li" },
  {  name: "Beryllium", weight: 9.0122, symbol: "Be" },
  {  name: "Boron", weight: 10.811, symbol: "B" },
  {  name: "Carbon", weight: 12.0107, symbol: "C" },
  {  name: "Nitrogen", weight: 14.0067, symbol: "N" },
  {  name: "Oxygen", weight: 15.9994, symbol: "O" },
  {  name: "Fluorine", weight: 18.9984, symbol: "F" },
  {  name: "Neon", weight: 20.1797, symbol: "Ne" },
];

@Component({
  selector: "app-financiero",
  templateUrl: "./financiero.component.html",
  styleUrls: ["./financiero.component.css"],
})
export class FinancieroComponent implements OnInit {
  displayedColumns: string[] = ["name", "weight", "symbol"];
  dataSource = ELEMENT_DATA;

  submitted: boolean;

  naturalForm: FormGroup;
  juridicoForm: FormGroup;

  currentYear;

  tipoPersona: string;

  lstCuentas: Cuenta[] = [];

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
    this.initNaturalForm();
    this.initJuridicoForm();
  }

  ngOnInit() {
    const cuenta1: Cuenta = new Cuenta();
    cuenta1.nombre = "ingresos";
    cuenta1.anioUltimo = 1200;
    cuenta1.anioPenultimo = 3000;
    const cuenta2: Cuenta = new Cuenta();
    cuenta2.nombre = "gastos";
    cuenta2.anioUltimo = 4;
    cuenta2.anioPenultimo = 7;

    this.lstCuentas.push(cuenta1);
    this.lstCuentas.push(cuenta2);

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
