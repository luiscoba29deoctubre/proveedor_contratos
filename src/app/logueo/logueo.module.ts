import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { OnlyNumbersDirective } from "../common/directives/only-numbers/only-numbers.directive";
import { AuthGuardService } from "../common/services/auth/auth-guard.service";
import { UsuarioService } from "../common/services/usuario.service";
import { MaterialModule } from "../material-module";
import { SharedModule } from "../shared/shared.module";
import { ApiEndpoints } from "./api.endpoints";
import { ForgotPassComponent } from "./forgot-pass/forgot-pass.component";
import { ForgotPassService } from "./forgot-pass/forgot-pass.service";
import { LoginComponent } from "./login/login.component";
import { LoginService } from "./login/login.service";
import { LogueoRoutes } from "./logueo.routing";
import { RegisterComponent } from "./register/register.component";

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,


    ForgotPassComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule,
    SharedModule,
    CommonModule,
    FormsModule,

    RouterModule.forChild(LogueoRoutes),
  ],

  providers: [
    ApiEndpoints,
    AuthGuardService,
    LoginService,
    UsuarioService,
    ForgotPassService,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LogueoModule {
  constructor() {
    //  console.log("logueo module");
  }
}
