import { Component, OnInit } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { Usuario } from "../../common/domain/usuario";

import { UsuarioService } from "../../common/services/usuario.service";

import { NgxSpinnerService } from "ngx-spinner";

/**
 * Componente para la actualización de password de usuarios
 */
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit {
  /** Objeto Usuario */
  usuario: Usuario;
  /** Formulario Cambio de Password */
  changePassForm: FormGroup;
  /** Flag que indica si el formulario ya se hizo submit */
  submitted: boolean;
  /** Flag que indica que el correo ingresado ya está registrado */
  errorPass0: boolean;
  /** Object para control de mensajes de usuario */
  alerts = {
    msg: "",
    error: "",
  };

  /**
   * Constructor del componente {@link ChangePasswordComponent}
   * @param fb
   * @param spinner
   */
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private usuarioService: UsuarioService
  ) {
    this.initForm();
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit() {
    this.usuarioService.getEmail().subscribe(
      (usuario) => {
        this.usuario = usuario;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * Inicializa el Formulario de Cambio de Password
   */
  private initForm() {
    this.changePassForm = this.fb.group({
      pass0: [null, [Validators.required]],
      pass1: [null, [Validators.required]],
      pass2: [null, [Validators.required]],
    });
  }

  /**
   * Actualiza el password de usuario
   *
   * @param value Valor del formulario
   * @param valid Estado del formulario
   */
  changePass(value: any, valid: boolean) {
    this.submitted = true;
    if (valid) {
      if (
        this.changePassForm.get("pass1").value !==
        this.changePassForm.get("pass2").value
      ) {
        this.alerts.error = "Las nuevas claves no coinciden";
      } else {
        this.alerts.error = "";
        this.spinner.show();

        const valuePass1 = this.changePassForm.get("pass1").value;

        this.usuarioService.changePass(valuePass1).subscribe(
          (data) => {
            if (data === true) {
              this.alerts.msg = "Clave actualizado exitosamente";
              this.alerts.error = null;
            } else {
              this.alerts.msg = null;
              this.alerts.error = "Ocurrio un error al actualizar la clave";
            }
            this.spinner.hide();
          },
          (error) => {
            console.log(error);
            this.alerts.msg = null;
            this.alerts.error = "Ocurrio un error al actualizar la clave";
            this.spinner.hide();
          }
        );
      }
    }
  }

  /**
   * Verfifica si la Clave ingresada es correcta
   *
   * @param value Valor del formulario
   * @param valid Estado del formulario
   */
  validatePass() {
    const valuePass0 = this.changePassForm.get("pass0").value;

    console.log("imprimimos el contenido", valuePass0);
    if (valuePass0 !== "" && valuePass0 !== null) {
      this.spinner.show();
      console.log("no es vacío");
      this.usuarioService.validatePassUsuario(valuePass0).subscribe(
        (data) => {
          this.errorPass0 = data ? false : true;
            this.spinner.hide();
        },
        (error) => {
          console.log(error);
          this.alerts.msg = null;
          this.alerts.error = "Ocurrio un Error al actualizar el Password";
          this.spinner.hide();
        }
      );
    } else {
      console.log("es vacio");
    }
  }
}
