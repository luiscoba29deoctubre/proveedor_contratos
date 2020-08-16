import { Component, AfterViewInit, OnInit } from "@angular/core";

import { ProcessIDB } from "../shared/process.indexedDB";
import { NotificationService } from "../shared/services/notification.service";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { FormularioService } from "../items-sidenav/formularios/formulario.service";

import { NgxSpinnerService } from "ngx-spinner";
import { ParamService } from "./param.service";
import { dbConfig } from "./indexedDB";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  /** Objeto processIDB para llenar todos los parámetros del sistema */
  processIDB: ProcessIDB;
  constructor(
    private notifyService: NotificationService,
    private dbService: NgxIndexedDBService,
    private paramService: ParamService,
    private spinner: NgxSpinnerService
  ) {
    dbConfig;
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

    console.log("entra en loadAllParameters");

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
