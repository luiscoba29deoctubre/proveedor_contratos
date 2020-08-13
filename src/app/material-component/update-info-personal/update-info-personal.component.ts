import { Component, OnInit } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { Usuario } from "../../common/domain/usuario";
import { SpinnerBlockService } from "../../common/components/spinner-block/spinner-block.service";
import { UsuarioService } from "../../common/services/usuario.service";

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
    private spinner: SpinnerBlockService,
    private usuarioService: UsuarioService
  ) {
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
    this.spinner.start();
    this.usuarioService
      .findUsuario()
      .subscribe(
        (usuario) => {
                    this.usuario = usuario;
          this.updateInfoForm.get("nombre").setValue(this.usuario.nombre);
          this.updateInfoForm.get("apellidos").setValue(this.usuario.apellidos);
          this.updateInfoForm.get("correo").setValue(this.usuario.correo);
          this.updateInfoForm.get("telefono").setValue(this.usuario.telefono);
          this.spinner.stop();
        },
        (error) => {
          console.log(error);
          this.spinner.stop();
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
      this.spinner.start();

      sessionStorage.setItem("usuario", value.usuario);

      this.usuario.nombre = value.nombre;
      this.usuario.apellidos = value.apellidos;
      this.usuario.correo = value.correo;
      this.usuario.telefono = value.telefono;

      this.usuarioService.updateUsuario(this.usuario).subscribe(
        (data) => {
          this.usuario = data;
          this.alerts.msg = "Información actualizada";
          this.spinner.stop();
          console.log("llegaaaaaaaaaaaaaa");
        },
        (error) => {
          console.log(error);
          this.alerts.error = "Error al actualizar la información";
          this.spinner.stop();
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
