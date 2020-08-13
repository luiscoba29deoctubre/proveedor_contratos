import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiEndpoints } from "../api.endpoints";

/**
 * Servicio para el manejo de 'Olvido clave'
 */
@Injectable({
  providedIn: "root",
})
export class ForgotPassService {
  /**
   * Contructor del servicio {@link ForgotPassService}
   *
   * @param http
   * @param endpoints
   */
  constructor(private http: HttpClient, private endpoints: ApiEndpoints) {}

  /**
   * Llama el servicio de envio de correos
   *
   * @param email Email del usuario
   */
  sendMail(email: string): Observable<any> {
    return this.http.post(this.endpoints.url_api_forgot_pass_usuario, {
      correo: email,
    });
  }
}
