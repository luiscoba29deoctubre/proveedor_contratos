import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { LogueoRoutes } from "./logueo.routing";
import { SpinnerBlockService } from "../common/components/spinner-block/spinner-block.service";
import { LoginService } from "./login/login.service";
import { ApiEndpoints } from "./api.endpoints";
import { AuthGuardService } from "../common/services/auth/auth-guard.service";
import { UsuarioService } from "../common/services/usuario.service";
import { DemoMaterialModule } from "../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";

import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "../shared/shared.module";

import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";

import { HrefDirective } from "../common/directives/href/href.directive";
import { OnlyNumbersDirective } from "../common/directives/only-numbers/only-numbers.directive";
import { RegisterComponent } from "./register/register.component";
import { ForgotPassService } from "./forgot-pass/forgot-pass.service";
import { ForgotPassComponent } from "./forgot-pass/forgot-pass.component";



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    HrefDirective,
    OnlyNumbersDirective,
    LogoutComponent,
    ForgotPassComponent,
  ],
  imports: [
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DemoMaterialModule,
    FlexLayoutModule,

    RouterModule.forChild(LogueoRoutes),

  ],

  providers: [
    ApiEndpoints,
    SpinnerBlockService,
    AuthGuardService,
    LoginService,
    UsuarioService,
    ForgotPassService,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LogueoModule {
  constructor() {
    console.log("logueo module");
  }
}
