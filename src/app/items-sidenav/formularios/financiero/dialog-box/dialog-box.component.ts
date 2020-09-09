import { Component, Inject, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ParamPerfilFinanciero } from "../../../../common/dtos/parameters";

@Component({
  selector: "app-dialog-box",
  templateUrl: "./dialog-box.component.html",
  styleUrls: ["./dialog-box.component.css"],
})
export class DialogBoxComponent {

  action: string;

  anio: number;
  local_data: any;
  cuenta: string;
  resultadoPenultimo:number;
  resultadoUltimo:number;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ParamPerfilFinanciero
  ) {
    this.local_data = { ...data };

    this.action = this.local_data.action;
    
    this.anio = this.local_data.anio;
    this.resultadoPenultimo = this.local_data.resultadoPenultimo;
    this.resultadoUltimo = this.local_data.resultadoUltimo;
    this.cuenta = data.cuenta;
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: "Cancelar" });
  }
}
