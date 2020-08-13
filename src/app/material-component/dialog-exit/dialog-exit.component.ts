import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";

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

  constructor(private router: Router, public dialog: MatDialog) {}

  openDialog(): void {
    this.dialog.open(DialogExitComponent, {
      width: "250px",
    });
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(["/"]);
    this.dialog.closeAll();
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }
}
