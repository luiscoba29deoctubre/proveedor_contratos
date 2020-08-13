import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { Usuario } from "../domain/usuario";
import { ApiEndpoints } from "../../logueo/api.endpoints";
import { HttpClient } from "@angular/common/http";

/**
 * Servicio para el manejo de la data de usuarios
 */
@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  /**
   * Contructos del servicio {@link UsuarioService}
   *
   * @param http
   * @param endpoints
   */
  constructor(private http: HttpClient, private endpoints: ApiEndpoints) {}

  /**
   * Registra un usuario
   *
   * @param usuario Usuario a registrar
   */
  public saveUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.endpoints.url_api_usuarios, usuario);
  }

  /**
   * Actualiza un usuario
   *
   * @param usuario Usuario a actualizar
   */
  public updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.patch(this.endpoints.url_api_usuarios, usuario);
  }

  /**
   * Valida si el email ya está registrado
   *
   * @param email Email a validar
   */
  public validateEmailUsuario(email: string): Observable<any> {
    return this.http.get(
      this.endpoints.url_api_validate_email_usuario + "/" + email
    );
  }

  /**
   * Verifica si la clave es correcta
   *
   * @param clave Clave a verificar
   */
  public verifyPassUsuario(password: string): Observable<any> {
    return this.http.post(this.endpoints.url_api_verify_pass_usuario, password);
  }

  /**
   * Obtiene un usuario por Email
   *
   * @param email
   */
  public findUsuario(): Observable<Usuario> {
    return this.http.get(
      this.endpoints.url_api_find_usuario
    );
  }

  /**
   * Obtiene un usuario por Email
   *
   * @param email
   */
  public getEmail(): Observable<Usuario> {
    return this.http.get(this.endpoints.url_api_get_email);
  }

  /**
   * Actualiza el password de usuario
   *
   * @param usuario
   */
  public changePass(usuario: Usuario) {
    return this.http.put(this.endpoints.url_api_change_pass_usuario, usuario);
  }

  /**
   * Obtiene un usuario por su id
   *
   * @param id Id usuario
   */
  public getUsuarioById(id: number): Observable<Usuario> {
    /*return this.http
      .get(this.endpoints.url_api_usuarios + "/" + id)
   //   .map((response: Response) => <Usuario>response.json())
      .catch((error) => {
        return Observable.throw(error.json().error || "Server error");
      });*/
    return Observable.throw("Server error");
  }
}
