import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ParamService } from "../../dashboard/param.service";
import { ProcessIDB } from "../../shared/bd/process.indexedDB";
import { NgxIndexedDBService } from "ngx-indexed-db";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
  processIDB: ProcessIDB;
  constructor(
    private paramService: ParamService,
    private dbService: NgxIndexedDBService,
    private spinner: NgxSpinnerService
  ) {
    this.processIDB = new ProcessIDB(dbService);
  }

  ngOnInit() {
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
