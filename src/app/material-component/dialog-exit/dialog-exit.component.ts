import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "app-dialog-exit",
  templateUrl: "./dialog-exit.component.html",
  styleUrls: ["./dialog-exit.component.scss"],
})
export class DialogExitComponent {
  animal: string;
  name: string;
  dialogRef;
  apiDenariusService: any;
  perfilUsuarioDenarius: any;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private dbService: NgxIndexedDBService
  ) {}

  openDialog(): void {
    this.dialog.open(DialogExitComponent, {
      width: "250px",
    });
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(["/"]);
    this.dialog.closeAll();

    // ****************** eliminamos la base de datos
    var DBDeleteRequest = window.indexedDB.deleteDatabase("Providers");

    DBDeleteRequest.onerror = function (event) {
      console.log("Error deleting database.");
    };

    DBDeleteRequest.onsuccess = function (event) {
      console.log("Database deleted successfully");
    };
    // ******************
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }
}
