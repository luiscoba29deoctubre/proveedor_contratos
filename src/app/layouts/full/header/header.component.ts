import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";
import { DialogExitComponent } from "../../../material-component/dialog-exit/dialog-exit.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class AppHeaderComponent {
  constructor(public dialog: MatDialog) {}
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogExitComponent, {
      width: "250px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("El dialogo fue cerrado");
    });
  }

  openAdmin() {
    console.log("ha hecho click");
  }
}
