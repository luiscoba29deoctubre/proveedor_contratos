import { IdentificacionDto } from "./../../common/DTO/form/IdentificacionDto";
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

import { LoginService } from "./login.service";
import { Usuario } from "../../common/domain/usuario";
import { SpinnerBlockService } from "../../common/components/spinner-block/spinner-block.service";
import { NotificationService } from "../../shared/services/notification.service";
import { Global } from "../../common/Global";
import { ParamService } from "../../common/services/param.service";

import { NgxIndexedDBService } from "ngx-indexed-db";
import { buildDriverProvider } from "protractor/built/driverProviders";
import { Base } from "../../shared/bd";

/**
 * Componente Login de Usuario
 */
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  /** ojito del password */
  hide = false;
  /** Formulario de Login */
  loginForm: FormGroup;
  /** Atributo usuario para el bind del formulario de login */
  usuarioLogin: Usuario;
  /** Flag que indica si el formulario ya se hizo submit */
  submitted: boolean;

  headers: string[];
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
    private spinner: SpinnerBlockService,
    private loginService: LoginService,
    private notifyService: NotificationService,
    private paramService: ParamService,
    private dbService: NgxIndexedDBService
  ) {
    this.initForm();
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
      this.spinner.start();
      this.loginService.login(value.email, value.password).subscribe(
        (tokeninicial) => {
          console.log("tokeninicial", tokeninicial);

          sessionStorage.setItem("token", tokeninicial.token);

          Global.identificacion = tokeninicial.identificacionDto;

          // carga de los parametros de la app
          this.loadAllParameters();

          this.router.navigate(["/dashboard"]);
          this.showToasterSuccess();
          this.spinner.stop();
        },
        (error) => {
          console.log(error);
          this.showToasterError();
          this.spinner.stop();
        }
      );
    }
  }

  loadAllParameters() {
    this.paramService.getParameters().subscribe(
      (allParameters) => {
        console.log("allParameters llega", allParameters);

        const bd2: Base = new Base(this.dbService, allParameters);

        // cargamos 'identificacion'
   /*     Global.identificacion = allParameters.IdentificacionDto;

        // cargamos la lista de personas
        Global.lstTipoPersona = allParameters.lstTipoPersona;

        console.log("Global.lstTipoPersona", Global.lstTipoPersona);*/
      },
      (error) => {
        console.log(error);
        this.showToasterError();
        this.spinner.stop();
      }
    );
  }

  closeError() {
    this.submitted = false;
  }
}
