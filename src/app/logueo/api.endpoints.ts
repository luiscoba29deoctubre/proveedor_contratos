import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable()
export class ApiEndpoints {
  // API
  /** Url Base */
  public url_base: string = environment.host + "/proveedor-api";

  /** Versión de la API */
  public api_version = "/v1";

  /** Url API */
  public url_api: string = this.url_base + this.api_version;

  // Login
  /** Url Login */
  public url_api_auth_login: string = this.url_api + "/auth/login";

  // Usuarios
  public url_api_usuarios: string = this.url_api + "/users";

  // Validaciones
  public url_api_validaciones: string = this.url_api + "/valid";

  // Procesos
  public url_api_procesos: string = this.url_api + "/process";

  // Formulario
  public url_api_formulario: string = this.url_api + "/forms";

  public url_api_validate_email_usuario: string =
    this.url_api_validaciones + "/validate-email";
  // obtiene el email
  public url_api_get_email: string = this.url_api_usuarios + "/get-email";

  public url_api_find_usuario: string = this.url_api_usuarios + "/find-user";

  public url_api_change_pass_usuario: string =
    this.url_api_usuarios + "/change-pass";

  // proceso de envio de correo cuando se olvida el correo
  public url_api_forgot_pass_usuario: string =
    this.url_api_procesos + "/forgot-pass";

  public url_api_verify_pass_usuario: string =
    this.url_api_validaciones + "/validate-pass";

  // proceso de obtención de parametros
  public url_api_get_parameters: string = this.url_api_procesos + "/get-param";

  // proceso de obtención de formularios
  public url_api_get_forms: string = this.url_api_formulario + "/get-forms";

  // Crear nuevo usuario
  public url_api_new_user: string = this.url_api_usuarios + "/";

  // Roles
  public url_api_roles: string = this.url_api + "/roles";

  // guardar identificacion
  public url_api_save_identification: string =
    this.url_api_formulario + "/save-identification";
}
