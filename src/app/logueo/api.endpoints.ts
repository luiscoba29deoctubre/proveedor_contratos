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

  public url_api_find_usuario: string = this.url_api_usuarios + "/find-user";

  public url_api_change_pass_usuario: string =
    this.url_api_usuarios + "/change-pass";

  // proceso de envio de correo cuando se olvida el correo
  public url_api_forgot_pass_usuario: string =
    this.url_api_procesos + "/forgot-pass";

  public url_api_validate_pass_usuario: string =
    this.url_api_validaciones + "/validate-pass";

  // proceso de obtención de parametros
  public url_api_get_parameters: string = this.url_api_procesos + "/get-param";

  // proceso de obtención del formulario 'identificacion'
  public url_api_get_info_contacto: string =
    this.url_api_formulario + "/get-info-contacto";

  // proceso de obtención del formulario 'identificacion'
  public url_api_get_identificacion: string =
    this.url_api_formulario + "/get-identifica";

  // proceso de obtención del formulario 'empresarial'
  public url_api_get_empresarial: string =
    this.url_api_formulario + "/get-empresarial";

  public url_api_get_financiero: string =
    this.url_api_formulario + "/get-financiero";

  public url_api_get_operativo: string =
    this.url_api_formulario + "/get-operativo";

  public url_api_get_comercial: string =
    this.url_api_formulario + "/get-comercial";

  public url_api_get_documetal: string =
    this.url_api_formulario + "/get-documental";

  public url_api_get_aceptacion: string =
    this.url_api_formulario + "/get-aceptacion";

  public url_api_download_pdf: string =
    this.url_api_formulario + "/download-pdf";

  public url_api_upload_pdf: string = this.url_api_formulario + "/upload-pdf";

  public url_api_upload_pdf_firmado: string =
    this.url_api_formulario + "/upload-pdf-firmado";

  public url_api_download_aceptacion: string =
    this.url_api_formulario + "/download-pdf";

  // Crear nuevo usuario
  public url_api_new_user: string = this.url_api_usuarios + "/";

  // guardar identificacion
  public url_api_save_identification: string =
    this.url_api_formulario + "/save-identification";

  // guardar identificacion
  public url_api_save_empresarial: string =
    this.url_api_formulario + "/save-empresarial";

  public url_api_save_operativo: string =
    this.url_api_formulario + "/save-operativo";

  public url_api_save_comercial: string =
    this.url_api_formulario + "/save-comercial";

  public url_api_save_aceptacion: string =
    this.url_api_formulario + "/save-aceptacion";

  // guardar el perfil financiero de persona Juridico
  public url_api_save_financiero_juridico: string =
    this.url_api_formulario + "/save-financiero-juridico";

  // guardar el perfil financiero de persona Natural
  public url_api_save_financiero_natural: string =
    this.url_api_formulario + "/save-financiero-natural";

  // guardar informacion de contacto
  public url_api_save_info_contacto: string =
    this.url_api_formulario + "/save-info-contacto";

  // elimina una actividad
  public url_api_delete_actividad: string =
    this.url_api_formulario + "/delete-actividad";

  public url_api_update_perfilFinanciero: string =
    this.url_api_formulario + "/update-perfilFinanciero";
}
