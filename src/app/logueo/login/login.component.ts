import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

import { LoginService } from "./login.service";
import { Usuario } from "../../common/domain/usuario";
import { NotificationService } from "../../shared/services/notification.service";

import { ParamService } from "../../common/services/param.service";

import { NgxIndexedDBService } from "ngx-indexed-db";
import { ProcessIDB } from "../../shared/process.indexedDB";

import { NgxSpinnerService } from "ngx-spinner";

/**
 * Componente Login de Usuario
 */
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  /** Formulario de Login */
  loginForm: FormGroup;
  /** Atributo usuario para el bind del formulario de login */
  usuarioLogin: Usuario;
  /** Flag que indica si el formulario ya se hizo submit */
  submitted: boolean;
  /** Objeto processIDB para llenar todos los parámetros del sistema */
  processIDB: ProcessIDB;
  /**
   * Constructor del Componente {@link LoginComponent}
   *
   * @param fb Builder de Formularios
   * @param router
   * @param spinner
   * @param loginService
   * @param notifyService
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private notifyService: NotificationService,
    private paramService: ParamService,
    private dbService: NgxIndexedDBService,
    private spinner: NgxSpinnerService
  ) {
    this.initForm();
    this.processIDB = new ProcessIDB(dbService);
  }
  // sacado de https://morioh.com/p/526559a86600 el Toast que muestra mensajes
  showToasterSuccess() {
    this.notifyService.showSuccess("Acceso correcto", "Login");
  }

  showToasterError() {
    this.notifyService.showError("Usuario o clave es incorrecta", "Login");
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit() {}

  /**
   * Inicializa el Formulario de Login
   */
  private initForm() {
    this.loginForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      password: ["", [Validators.required]],
    });
  }

  /**
   * Valida las credenciales de usuario ingresadas en el formulario
   *
   * @param value Valor del formulario
   * @param valid Estado del formulario
   */
  login(value: any, valid: boolean) {
    this.submitted = true;
    if (valid) {
      console.log("pasa la validacion");

      this.spinner.show();

      this.loginService.login(value.email, value.password).subscribe(
        (tokeninicial) => {
          // carga de los parametros de la app
          this.loadAllParameters();

          this.router.navigate(["/dashboard"]);
          this.showToasterSuccess();

          this.spinner.hide();
        },
        (error) => {
          console.log(error);
          this.showToasterError();
          this.spinner.hide();
        }
      );
    }
  }

  loadAllParameters() {
    this.paramService.getParameters().subscribe(
      (allParameters) => {
        // llenamos la base 'indexed-db'
        this.processIDB.fillingParameters(allParameters);
      },
      (error) => {
        console.log(error);

        this.spinner.hide();
      }
    );
  }

  closeError() {
    this.submitted = false;
  }
}
