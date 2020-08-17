import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { ProcessIDB } from "../../shared/process.indexedDB";

@Component({
  selector: "app-dialog-exit",
  templateUrl: "./dialog-exit.component.html",
  styleUrls: ["./dialog-exit.component.scss"],
})
export class DialogExitComponent {
  /** Objeto processIDB para llenar todos los datos del usuario */
  processIDB: ProcessIDB;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private dbService: NgxIndexedDBService
  ) {
    this.processIDB = new ProcessIDB(dbService);
  }

  openDialog(): void {
    this.dialog.open(DialogExitComponent, {
      width: "250px",
    });
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(["/"]);
    this.dialog.closeAll();
    this.processIDB.clearIndexedDB(); // para borrar los stores del indexedDB
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }
}
