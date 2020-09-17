import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError } from "rxjs/internal/operators/catchError";
import { map } from "rxjs/internal/operators/map";
import { Observable } from "rxjs/Observable";
import { TokenInitial } from "../../common/domain/tokeninitial";
import { ApiEndpoints } from "../api.endpoints";

const helper = new JwtHelperService();
/**
 * Servicio para el manejo del Login
 */
@Injectable({
  providedIn: "root",
})
export class LoginService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  /**
   * Contructor del servicio {@link LoginService}
   *
   * @param http
   * @param endpoints
   */
  constructor(private http: HttpClient, private endpoints: ApiEndpoints) {}

  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  logout(): void {
    sessionStorage.removeItem("token");
    this.loggedIn.next(false);
  }

  public checkExpirationToken(): void {
    const userToken = sessionStorage.getItem("token");
    const isExpired = helper.isTokenExpired(userToken);
    isExpired ? this.logout() : this.loggedIn.next(true);
  }

  private saveToken(token: string): void {
    sessionStorage.setItem("token", token);
  }

  private saveUsuario(usuario: string): void {
    sessionStorage.setItem("usuario", usuario);
  }

  /**
   * Llama el servicio de autenticación de credenciales
   *
   * @param email Email del usuario
   * @param password Password del usuario
   */
  public login(email: string, password: string): Observable<TokenInitial> {
    const authData: any = {
      email,
      password,
    };
    return this.http
      .post<TokenInitial>(this.endpoints.url_api_auth_login, authData)
      .pipe(
        map((response: TokenInitial) => {
          const usuario = helper.decodeToken(response.token).usuario;
          const usoTemp = helper.decodeToken(response.token).usoTemp;
          this.saveUsuario(usuario);
          this.saveToken(response.token);
          this.loggedIn.next(true);
          return usoTemp;
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
