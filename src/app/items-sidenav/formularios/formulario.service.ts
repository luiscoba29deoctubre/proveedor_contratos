import { IdentificacionDto } from "./../../common/dtos/form/IdentificacionDto";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ApiEndpoints } from "../../logueo/api.endpoints";
import { catchError } from "rxjs/internal/operators/catchError";
import { map } from "rxjs/internal/operators/map";
import { throwError } from "rxjs";

/**
 * Servicio para el manejo del formulario que ingresa el proveedor
 */
@Injectable({
  providedIn: "root",
})
export class FormularioService {
  /**
   * Contructos del servicio {@link FormularioService}
   *
   * @param http
   * @param endpoints
   */
  constructor(private http: HttpClient, private endpoints: ApiEndpoints) {}

  /**
   * Registra formulario
   *
   * @param Identificacion registramaso el formulario 'identificacion'
   */
  public saveIdentificacion(
    identificacion: IdentificacionDto
  ): Observable<IdentificacionDto> {
    return this.http
      .post(this.endpoints.url_api_save_identification, identificacion)
      .pipe(
        map((identificacionDto: IdentificacionDto) => {
          console.log("vienneeeeeee", identificacionDto);
          return identificacionDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  /**
   * Obtiene formularios
   *
   * @param Identificacion registramos el formulario 'identificacion'
   */
  public getIdentificacion(): Observable<IdentificacionDto> {
    return this.http.get(this.endpoints.url_api_get_identificacion).pipe(
      map((identificacionDto: IdentificacionDto) => {
        return identificacionDto;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError("Something bad happened; please try again later.");
  }
}
