import { Component, OnInit } from "@angular/core";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import { ProcessIDB } from "../shared/bd/process.indexedDB";
import { NotificationService } from "../shared/services/notification.service";
import { ParamService } from "./param.service";
import { LoginService } from "../logueo/login/login.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  /** Objeto processIDB para llenar todos los parámetros del sistema */
  processIDB: ProcessIDB;
  constructor(
    private paramService: ParamService,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private dbService: NgxIndexedDBService,
    private notifyService: NotificationService
  ) {
    this.loginService.checkExpirationToken();
    this.processIDB = new ProcessIDB(dbService);
  }
  // sacado de https://morioh.com/p/526559a86600 el Toast que muestra mensajes
  showToasterSuccess() {
    this.notifyService.showSuccess("Acceso correcto", "Login");
  }

  showToasterError() {
    this.notifyService.showError("Usuario o clave es incorrecta", "Login");
  }

  ngOnInit(): void {
    // carga de los parametros de la app
    this.loadAllParameters();
  }

  loadAllParameters() {
    this.spinner.show();

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
}
