import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/internal/operators/catchError";
import { map } from "rxjs/internal/operators/map";
import { Observable } from "rxjs/Observable";
import { ComercialDto } from "../../common/dtos/form/ComercialDto";
import { DocumentalDto } from "../../common/dtos/form/DocumentalDto";
import { EmpresarialDto } from "../../common/dtos/form/EmpresarialDto";
import { FinancieroDto } from "../../common/dtos/form/FinancieroDto";
import { InfoContactoDto } from "../../common/dtos/form/InfoContactoDto";
import { OperativoDto } from "../../common/dtos/form/OperativoDto";
import { ApiEndpoints } from "../../logueo/api.endpoints";
import { AceptacionDto } from "./../../common/dtos/form/AceptacionDto";
import { IdentificacionDto } from "./../../common/dtos/form/IdentificacionDto";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
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

  public actualizarPerfilFinanciero(cuenta): Observable<FinancieroDto> {
    this.setTokenInHeader();

    return this.http
      .put(this.endpoints.url_api_update_perfilFinanciero, cuenta, {
        headers: this.headers,
      })
      .pipe(
        map((financieroDto: FinancieroDto) => {
          return financieroDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  /**
   * Registra formulario
   *
   * @param Identificacion registramaso el formulario 'identificacion'
   */
  public saveIdentificacion(identificacion): Observable<IdentificacionDto> {
    this.setTokenInHeader();

    return this.http
      .post(this.endpoints.url_api_save_identification, identificacion, {
        headers: this.headers,
      })
      .pipe(
        map((identificacionDto: IdentificacionDto) => {
          return identificacionDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveEmpresarial(empresarial): Observable<EmpresarialDto> {
    this.setTokenInHeader();

    return this.http
      .post(this.endpoints.url_api_save_empresarial, empresarial, {
        headers: this.headers,
      })
      .pipe(
        map((empresarialDto: EmpresarialDto) => {
          return empresarialDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveFinancieroJuridico(financieroNatural): Observable<FinancieroDto> {
    this.setTokenInHeader();

    return this.http
      .post(
        this.endpoints.url_api_save_financiero_juridico,
        financieroNatural,
        { headers: this.headers }
      )
      .pipe(
        map((financieroDto: FinancieroDto) => {
          return financieroDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveFinancieroNatural(financieroNatural): Observable<FinancieroDto> {
    this.setTokenInHeader();

    return this.http
      .post(this.endpoints.url_api_save_financiero_natural, financieroNatural, {
        headers: this.headers,
      })
      .pipe(
        map((financieroDto: FinancieroDto) => {
          return financieroDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  /**
   * Registra informacion de contacto
   *
   * @param InfoContacto registramos el formulario 'info-contacto'
   */
  public saveInfoContacto(infoContacto): Observable<InfoContactoDto> {
    this.setTokenInHeader();

    return this.http
      .post(this.endpoints.url_api_save_info_contacto, infoContacto, {
        headers: this.headers,
      })
      .pipe(
        map((infoContactoDto: InfoContactoDto) => {
          return infoContactoDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveOperativo(operativoDto): Observable<OperativoDto> {
    this.setTokenInHeader();

    return this.http
      .post(this.endpoints.url_api_save_operativo, operativoDto, {
        headers: this.headers,
      })
      .pipe(
        map((operativo: OperativoDto) => {
          return operativo;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveComercial(comercialDto): Observable<ComercialDto> {
    this.setTokenInHeader();

    return this.http
      .post(this.endpoints.url_api_save_comercial, comercialDto, {
        headers: this.headers,
      })
      .pipe(
        map((comercial: ComercialDto) => {
          return comercial;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  /**
   * Obtiene el formulario Identificacion
   *
   * @param Identificacion registramos el formulario 'identificacion'
   */
  public getIdentificacion(): Observable<IdentificacionDto> {
    this.setTokenInHeader();

    return this.http
      .get(this.endpoints.url_api_get_identificacion, { headers: this.headers })
      .pipe(
        map((identificacionDto: IdentificacionDto) => {
          return identificacionDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getFinanciero(): Observable<FinancieroDto> {
    this.setTokenInHeader();

    return this.http
      .get(this.endpoints.url_api_get_financiero, { headers: this.headers })
      .pipe(
        map((financieroDto: FinancieroDto) => {
          return financieroDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getEmpresarial(): Observable<EmpresarialDto> {
    this.setTokenInHeader();

    return this.http
      .get(this.endpoints.url_api_get_empresarial, { headers: this.headers })
      .pipe(
        map((empresarialDto: EmpresarialDto) => {
          return empresarialDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getOperativo(): Observable<OperativoDto> {
    this.setTokenInHeader();

    return this.http
      .get(this.endpoints.url_api_get_operativo, { headers: this.headers })
      .pipe(
        map((operativoDto: OperativoDto) => {
          return operativoDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getComercial(): Observable<ComercialDto> {
    this.setTokenInHeader();

    return this.http
      .get(this.endpoints.url_api_get_comercial, { headers: this.headers })
      .pipe(
        map((comercialDto: ComercialDto) => {
          return comercialDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getDocumental(): Observable<DocumentalDto> {
    this.setTokenInHeader();

    return this.http
      .get(this.endpoints.url_api_get_documetal, { headers: this.headers })
      .pipe(
        map((documentalDto: DocumentalDto) => {
          return documentalDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public getAceptacion(): Observable<AceptacionDto> {
    this.setTokenInHeader();

    return this.http
      .get(this.endpoints.url_api_get_aceptacion, { headers: this.headers })
      .pipe(
        map((aceptacionDto: AceptacionDto) => {
          return aceptacionDto;
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
  public getInfoContacto(): Observable<InfoContactoDto> {
    this.setTokenInHeader();

    return this.http
      .get(this.endpoints.url_api_get_info_contacto, { headers: this.headers })
      .pipe(
        map((infoContactoDto: InfoContactoDto) => {
          return infoContactoDto;
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
    this.notifyService.showError(
      "Por favor, vuelva a loguearse",
      "Sesión caducada"
    );
  }
}
