import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Usuario } from "../../common/domain/usuario";
import { UsuarioService } from "../../common/services/usuario.service";
import { LoginService } from "../../logueo/login/login.service";

/**
 * Componente del formulario de actualización de datos del usuario
 */
@Component({
  selector: "app-update-info-personal",
  templateUrl: "./update-info-personal.component.html",
  styleUrls: ["./update-info-personal.component.css"],
})
export class UpdateInfoPersonalComponent implements OnInit {
  /** Formulario de Update Info Usuario */
  updateInfoForm: FormGroup;
  /** Model Usuario */
  usuario: Usuario;
  /** Flag que indica que el correo ingresado ya está registrado */
  errorCorreo: boolean;
  /** Flag que indica si el formulario ya se hizo submit */
  submitted: boolean;
  /** Object para control de mensajes de usuario */
  alerts = {
    msg: "",
    error: "",
  };

  /**
   * Constructor del componente {@link UpdateInfoPersonalComponent}
   * @param fb
   */
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private usuarioService: UsuarioService
  ) {
    this.loginService.checkExpirationToken();
    this.initForm();
    this.loadInfoUsuario();
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit() {
    this.errorCorreo = false;
    this.usuario = new Usuario();
  }

  /**
   * Inicializa el Formulario de Update Información Usuario
   */
  private initForm() {
    this.updateInfoForm = this.fb.group({
      nombre: [null, [Validators.required]],
      apellidos: [null, [Validators.required]],
      correo: [null, [Validators.required, Validators.email]],
      telefono: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
  }

  /**
   * Carga la información del usuario
   */
  private loadInfoUsuario() {
    this.spinner.show();
    this.usuarioService.findUsuario().subscribe(
      (usuario) => {
        this.usuario = usuario;
        this.updateInfoForm.get("nombre").setValue(this.usuario.nombre);
        this.updateInfoForm.get("apellidos").setValue(this.usuario.apellidos);
        this.updateInfoForm.get("correo").setValue(this.usuario.correo);
        this.updateInfoForm.get("telefono").setValue(this.usuario.telefono);
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  /**
   * Valida si el Email ingresado ya está registrado
   */
  validateEmail() {
    const valueEmail = this.updateInfoForm.get("correo").value;
    this.usuarioService.validateEmailUsuario(valueEmail).subscribe(
      (data) => (this.errorCorreo = data > 0 ? true : false),
      (error) => console.log(error)
    );
  }

  updateInfoUsuario(value: any, valid: boolean) {
    this.submitted = true;

    console.log("dentro de update", valid);
    if (valid) {
      this.spinner.show();

      this.usuario.nombre = value.nombre;
      this.usuario.apellidos = value.apellidos;
      this.usuario.correo = value.correo;
      this.usuario.telefono = value.telefono;

      const nombreUsuario = value.nombre + " " + value.apellidos;
      sessionStorage.setItem("usuario", nombreUsuario);

      this.usuarioService.updateUsuario(this.usuario).subscribe(
        (data) => {
          this.usuario = data;
          this.alerts.msg =
            "Información actualizada, actualize el navegador para ver los cambios reflejados";
          this.spinner.hide();
        },
        (error) => {
          console.log(error);
          this.alerts.error = "Error al actualizar la información";
          this.spinner.hide();
          this.alerts.msg = "";
        }
      );
    }
  }

  closeSuccess() {
    this.submitted = false;
    console.log("clickkkkkkkkkkkkk");
    this.alerts.msg = "";
  }
}
