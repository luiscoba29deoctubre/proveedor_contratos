import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { throwError } from "rxjs";
import { catchError } from "rxjs/internal/operators/catchError";
import { map } from "rxjs/internal/operators/map";
import { Observable } from "rxjs/Observable";
import { ApiEndpoints } from "../../logueo/api.endpoints";
import { NotificationService } from "../../shared/services/notification.service";

/**
 * Servicio para el manejo del formulario que ingresa el proveedor
 */
@Injectable({
  providedIn: "root",
})
export class FormularioService {
  headers: HttpHeaders;

  /**
   * Contructos del servicio {@link FormularioService}
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
      auth: `Bearer ${sessionStorage.getItem("token")}`,
    });
    this.headers = headerWithToken;
  }

  private saveToken(token: string): void {
    sessionStorage.setItem("token", token);
  }

  /**
   * Eliminamos una actividad de la lista de actividades
   *
   * @param id enviamos el id de la tabla TproveedorActividad
   */
  public deleteActividad(id: number): Observable<any> {
    this.setTokenInHeader();

    return this.http.get(this.endpoints.url_api_delete_actividad + "/" + id, {
      headers: this.headers,
    });
  }

  public actualizarPerfilFinanciero(cuenta): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .put<any>(this.endpoints.url_api_update_perfilFinanciero, cuenta, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  /**
   * Registra formulario
   *
   * @param Identificacion registramaso el formulario 'identificacion'
   */
  public saveIdentificacion(identificacion): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .post<any>(this.endpoints.url_api_save_identification, identificacion, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveEmpresarial(empresarial): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .post<any>(this.endpoints.url_api_save_empresarial, empresarial, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveFinancieroJuridico(financieroNatural): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .post<any>(
        this.endpoints.url_api_save_financiero_juridico,
        financieroNatural,
        { headers: this.headers, observe: "response" }
      )
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveFinancieroNatural(financieroNatural): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .post<any>(
        this.endpoints.url_api_save_financiero_natural,
        financieroNatural,
        {
          headers: this.headers,
          observe: "response",
        }
      )
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  /**
   * Registra informacion de contacto
   *
   * @param InfoContacto registramos el formulario 'info-contacto'
   */
  public saveInfoContacto(infoContacto): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .post<any>(this.endpoints.url_api_save_info_contacto, infoContacto, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveOperativo(operativoDto): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .post<any>(this.endpoints.url_api_save_operativo, operativoDto, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveComercial(comercialDto): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .post<any>(this.endpoints.url_api_save_comercial, comercialDto, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }
  public saveAceptacion(comercialDto): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .post<any>(this.endpoints.url_api_save_aceptacion, comercialDto, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  /**
   * Obtiene el formulario Identificacion
   *
   * @param Identificacion registramos el formulario 'identificacion'
   */
  public getIdentificacion(): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .get<any>(this.endpoints.url_api_get_identificacion, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getFinanciero(): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .get<any>(this.endpoints.url_api_get_financiero, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getEmpresarial(): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .get<any>(this.endpoints.url_api_get_empresarial, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getOperativo(): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .get<any>(this.endpoints.url_api_get_operativo, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getComercial(): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .get<any>(this.endpoints.url_api_get_comercial, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getDocumental(): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .get<any>(this.endpoints.url_api_get_documetal, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getAceptacion(): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .get<any>(this.endpoints.url_api_get_aceptacion, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  /* public downloadPdf(): Observable<any> {
    return this.http
      .get(this.endpoints.url_api_download_pdf, {
        headers: this.headers,
        responseType: "blob",
      })
      .toPromise()
      .then((blob) => {
      //  saveAs(blob, "dump.gz");
      })
      .catch((err) => console.error("download error = ", err));
  }
  */

  /**
   * Obtiene el formulario de informacion de contacto
   *
   * @param InfoContacto
   */
  public getInfoContacto(): Observable<any> {
    this.setTokenInHeader();

    return this.http
      .get<any>(this.endpoints.url_api_get_info_contacto, {
        headers: this.headers,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const newToken = response.headers.get("auth");
          this.saveToken(newToken);

          return response;
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
}
