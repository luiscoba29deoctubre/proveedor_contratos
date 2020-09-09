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
import { ParamPerfilFinanciero } from "../../common/dtos/parameters";

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
  constructor(private http: HttpClient, private endpoints: ApiEndpoints) {
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + "user.jwt,", // Auth header
      //No other headers needed
    });
  }

  /**
   * Eliminamos una actividad de la lista de actividades
   *
   * @param id enviamos el id de la tabla TproveedorActividad
   */
  public deleteActividad(id: number): Observable<any> {
    return this.http.get(this.endpoints.url_api_delete_actividad + "/" + id);
  }

  public actualizarPerfilFinanciero(cuenta): Observable<FinancieroDto> {
    return this.http
      .put(this.endpoints.url_api_update_perfilFinanciero, cuenta)
      .pipe(
        map((financieroDto: FinancieroDto) => {
          console.log("vienneeeeeee", financieroDto);
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

  public saveEmpresarial(empresarial): Observable<EmpresarialDto> {
    return this.http
      .post(this.endpoints.url_api_save_empresarial, empresarial)
      .pipe(
        map((empresarialDto: EmpresarialDto) => {
          console.log("vienneeeeeee", empresarialDto);
          return empresarialDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveFinancieroJuridico(financieroNatural): Observable<FinancieroDto> {
    return this.http
      .post(this.endpoints.url_api_save_financiero_juridico, financieroNatural)
      .pipe(
        map((financieroDto: FinancieroDto) => {
          console.log("vienneeeeeee", financieroDto);
          return financieroDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveFinancieroNatural(financieroNatural): Observable<FinancieroDto> {
    return this.http
      .post(this.endpoints.url_api_save_financiero_natural, financieroNatural)
      .pipe(
        map((financieroDto: FinancieroDto) => {
          console.log("vienneeeeeee", financieroDto);
          return financieroDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  /**
   * Registra informacion de contacto
   *
   * @param InfoContacto registramaso el formulario 'info-contacto'
   */
  public saveInfoContacto(infoContacto): Observable<InfoContactoDto> {
    return this.http
      .post(this.endpoints.url_api_save_info_contacto, infoContacto)
      .pipe(
        map((infoContactoDto: InfoContactoDto) => {
          console.log("vienneeeeeee", infoContactoDto);
          return infoContactoDto;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveOperativo(operativoDto): Observable<OperativoDto> {
    return this.http
      .post(this.endpoints.url_api_save_operativo, operativoDto)
      .pipe(
        map((operativo: OperativoDto) => {
          console.log("vienneeeeeee", operativo);
          return operativo;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public saveComercial(comercialDto): Observable<ComercialDto> {
    return this.http
      .post(this.endpoints.url_api_save_comercial, comercialDto)
      .pipe(
        map((comercial: ComercialDto) => {
          console.log("vienneeeeeee", comercial);
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
    return this.http.get(this.endpoints.url_api_get_identificacion).pipe(
      map((identificacionDto: IdentificacionDto) => {
        return identificacionDto;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  public getFinanciero(): Observable<FinancieroDto> {
    return this.http.get(this.endpoints.url_api_get_financiero).pipe(
      map((financieroDto: FinancieroDto) => {
        return financieroDto;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  public getEmpresarial(): Observable<EmpresarialDto> {
    return this.http.get(this.endpoints.url_api_get_empresarial).pipe(
      map((empresarialDto: EmpresarialDto) => {
        return empresarialDto;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  public getOperativo(): Observable<OperativoDto> {
    return this.http.get(this.endpoints.url_api_get_operativo).pipe(
      map((operativoDto: OperativoDto) => {
        return operativoDto;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  public getComercial(): Observable<ComercialDto> {
    return this.http.get(this.endpoints.url_api_get_comercial).pipe(
      map((comercialDto: ComercialDto) => {
        return comercialDto;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  public getDocumental(): Observable<DocumentalDto> {
    return this.http.get(this.endpoints.url_api_get_documetal).pipe(
      map((documentalDto: DocumentalDto) => {
        return documentalDto;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  public getAceptacion(): Observable<AceptacionDto> {
    return this.http.get(this.endpoints.url_api_get_aceptacion).pipe(
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
    return this.http.get(this.endpoints.url_api_get_info_contacto).pipe(
      map((infoContactoDto: InfoContactoDto) => {
        console.log("info contacto dto", infoContactoDto);
        return infoContactoDto;
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
