import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiEndpoints } from "../logueo/api.endpoints";
import { Observable } from "rxjs";

/**
 * Servicio para obtener los parametros del sistema, osea los datos que se cargarán en los combos
 */
@Injectable({
  providedIn: "root",
})
export class ParamService {
  /**
   * Contructos del servicio {@link ParamService}
   *
   * @param http
   * @param endpoints
   */
  constructor(private http: HttpClient, private endpoints: ApiEndpoints) {}

  /**
   *  Obtenemos los parametros del sistema
   */
  getParameters(): Observable<any> {
    return this.http.get(this.endpoints.url_api_get_parameters);
  }
}
