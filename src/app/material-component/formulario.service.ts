import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { ApiEndpoints } from "../logueo/api.endpoints";
import { IdentificacionDto } from "../common/DTO/form/IdentificacionDto";

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
    return this.http.post(
      this.endpoints.url_api_save_identification,
      identificacion
    );
  }
}
