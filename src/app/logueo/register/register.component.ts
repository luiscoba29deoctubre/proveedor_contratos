import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Usuario } from "../../common/domain/usuario";
import { UsuarioService } from "../../common/services/usuario.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  /** Formulario de Registro */
  registerForm: FormGroup;
  /** Atributo usuario para el bind del formulario de registro */
  usuario: Usuario;
  /** Flag que indica si el formulario ya se hizo submit */
  submitted: boolean;
  /** Object para control de mensajes de usuario */
  alerts = {
    msg: "",
    error: "",
  };
  /** Flag que indica que el correo ingresado ya está registrado */
  errorCorreo: boolean;
  /** Flag que indica que el correo ingresado ya está registrado, este flag no es modificable por el usuario*/
  errorCorreo2: boolean;
  /** Flag que indica que el usuario ya se registro con este formulario */
  registrado: boolean;

  /**
   * Constructor del Componente {@link RegisterComponent}
   *
   * @param fb
   * @param spinner
   * @param usuarioService
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
    this.errorCorreo = false;
    this.registrado = false;
  }

  /**
   * Inicializa el Formulario de Registro
   */
  private initForm() {
    this.registerForm = this.fb.group({
      correo: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      nombre: ["", [Validators.required]],
      apellidos: ["", [Validators.required]],
      telefono: ["", [Validators.required]],
    });
  }

  /**
   * Valida si el Email ingresado ya está registrado
   */
  validateEmail() {
    const valueEmail = this.registerForm.get("correo").value;
    this.usuarioService.validateEmailUsuario(valueEmail).subscribe(
      (data) => {
        if (data > 0) {
          this.errorCorreo = true;
          console.log("entra en true");
        } else {
          this.errorCorreo = false;
          console.log("entra en false");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * Cierra el mensaje de validacion del email
   */
  closeErrorCorreo() {
    this.errorCorreo = false;
  }

  /**
   * Registra un usuario
   *
   * @param value Valor del Formulario
   * @param valid Estado del formulario
   */
  saveRegister(value: any, valid: boolean) {
    this.submitted = true;

    this.validateEmail();

    console.log("valid", valid);
    // espacio
    console.log("this.registerForm", this.registerForm);

    if (valid) {
      this.spinner.show();

      const usuario: Usuario = new Usuario();
      usuario.correo = value.correo;
      usuario.nombre = value.nombre;
      usuario.apellidos = value.apellidos;
      usuario.telefono = value.telefono;

      this.usuarioService.saveUsuario(usuario).subscribe(
        (data) => {
          this.alerts.msg =
            "Usuario registrado exitosamente. Sus acceso son: correo " +
            data.correo +
            " y su clave ha sido enviada a su correo";
          this.registrado = true;
          this.spinner.hide();
        },
        (error) => {
          this.alerts.error = "Ocurrio un error al registrar el usuario";
          this.registrado = false;
          this.spinner.hide();
        }
      );
    }
  }

  /**
   * Cierra el mensaje de validacion del email
   */
  closeError() {
    this.submitted = false;
  }
}
