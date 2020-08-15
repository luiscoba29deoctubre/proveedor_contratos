import { Injectable } from "@angular/core";

import { ApiEndpoints } from "../api.endpoints";

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { TokenInitial } from "../../common/domain/tokeninitial";
import { throwError, BehaviorSubject } from "rxjs";
import { catchError } from "rxjs/internal/operators/catchError";
import { map } from "rxjs/internal/operators/map";
import { JwtHelperService } from "src/app/items-sidenav/node_modules/@auth0/angular-jwt";

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

  private checkToken(): void {
    const userToken = sessionStorage.getItem("token");
    const isExpired = helper.isTokenExpired(userToken);
    console.log("isExpiredddddd", isExpired);
    isExpired ? this.logout() : this.loggedIn.next(true);
  }

  private saveToken(token: string): void {
    sessionStorage.setItem("token", token);
  }

  private handlerError(err): Observable<never> {
    let errorMessage = "An error occured retrieving data";
    if (err) {
      errorMessage = `Error:code ${err.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  /**
   * Llama el servicio de autenticación de credenciales
   *
   * @param email Email del usuario
   * @param password Password del usuario
   */
  /*login(email: string, password: string): Observable<TokenInitial> {
    const data: any = {
      email: email,
      password: password,
    };
    return this.http
      .post<TokenInitial>(this.endpoints.url_api_auth_login, data)
      .pipe(catchError(this.handleError("login", email)));
  }*/

  public login(email: string, password: string): Observable<TokenInitial> {
    const authData: any = {
      email: email,
      password: password,
    };
    return this.http
      .post<TokenInitial>(this.endpoints.url_api_auth_login, authData)
      .pipe(
        map((res: TokenInitial) => {
          this.saveToken(res.token);
          this.loggedIn.next(true);
          return res;
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
