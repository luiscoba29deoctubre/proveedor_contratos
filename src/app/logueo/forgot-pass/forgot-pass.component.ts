import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ForgotPassService } from "./forgot-pass.service";

@Component({
  selector: "app-forgot-pass",
  templateUrl: "./forgot-pass.component.html",
  styleUrls: ["./forgot-pass.component.css"],
})
export class ForgotPassComponent implements OnInit {
  /** Formulario de Login */
  forgotForm: FormGroup;

  /** Flag que indica si el formulario ya se hizo submit */
  submitted: boolean;
  /** Object para control de mensajes de usuario */
  alerts = {
    msg: "",
    error: "",
  };
  /** Flag que indica que el correo ingresado ya está registrado */
  errorCorreo: boolean;
  /** Flag que indica que el usuario ya se registro con este formulario */
  enviado: boolean;

  /**
   * Constructor del Componente {@link ForgotPasswordComponent}
   *
   * @param fb Builder de Formularios
   * @param router
   * @param spinner
   * @param loginService
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private forgotPassService: ForgotPassService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.errorCorreo = false;
    this.enviado = false;
  }

  /**
   * Inicializa el Formulario de Login
   */
  private initForm() {
    this.forgotForm = this.fb.group({
      correo: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
    });
  }

  /**
   * Envia correo
   *
   * @param value Valor del Formulario
   * @param valid Estado del formulario
   */
  sendPass(value: any, valid: boolean) {
    this.submitted = true;

    if (valid) {
      this.spinner.show();

      this.forgotPassService.sendMail(value.correo).subscribe(
        (data) => {
          console.log("se realiza el envio", data);
          this.alerts.msg =
            "Envío de clave exitoso. Se ha enviado una clave temporal a su correo: " +
            data.correo;
          this.enviado = true;
          this.spinner.hide();
        },
        (error) => {
          this.alerts.error = "Ocurrio un error al enviar la clave temporal";
          this.enviado = false;
          this.spinner.hide();
        }
      );
    }
  }

  closeError() {
    this.submitted = false;
  }
}
