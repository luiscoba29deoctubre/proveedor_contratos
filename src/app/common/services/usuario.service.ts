import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { Usuario } from "../domain/usuario";
import { ApiEndpoints } from "../../logueo/api.endpoints";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { map } from "rxjs/internal/operators/map";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { NotificationService } from "../../shared/services/notification.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

/**
 * Servicio para el manejo de la data de usuarios
 */
@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  headers: HttpHeaders;

  /**
   * Contructos del servicio {@link UsuarioService}
   *
   * @param http
   * @param endpoints
   */
  constructor(
    private router: Router,
    private http: HttpClient,
    private endpoints: ApiEndpoints,
    private spinner: NgxSpinnerService,
    private notifyService: NotificationService
  ) {}

  setTokenInHeader() {
    const headerWithToken = new HttpHeaders({
      auth: "Bearer " + sessionStorage.getItem("token"),
    });
    this.headers = headerWithToken;
  }

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
  public validatePassUsuario(clave: string): Observable<any> {
    this.setTokenInHeader();
    return this.http
      .post<Boolean>(
        this.endpoints.url_api_validate_pass_usuario,
        { clave },
        {
          headers: this.headers,
        }
      )
      .pipe(
        map((res: Boolean) => {
          return res;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  private handleError(error: HttpErrorResponse) {
    this.spinner.show();
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
      if (error.status === 401) {
        this.showToasterError();
        this.router.navigate(["/"]);
      }
    }
    this.spinner.hide();
    // Return an observable with a user-facing error message.
    return throwError("Something bad happened; please try again later.");
  }

  showToasterError() {
    this.notifyService.showInfo(
      "Por favor, vuelva a loguearse",
      "Sesión caducada"
    );
  }

  /**
   * Obtiene un usuario por Email
   *
   * @param email
   */
  public findUsuario(): Observable<Usuario> {
    this.setTokenInHeader();
    return this.http.get(this.endpoints.url_api_find_usuario, {
      headers: this.headers,
    });
  }

  /**
   * Actualiza el password de usuario
   *
   * @param usuario
   */
  public changePass(clave: string) {
    this.setTokenInHeader();
    return this.http.put(
      this.endpoints.url_api_change_pass_usuario,
      {
        clave,
      },
      { headers: this.headers }
    );
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
