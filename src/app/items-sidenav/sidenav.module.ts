import "hammerjs";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";

import { MaterialModule } from "../material-module";
import { CdkTableModule } from "@angular/cdk/table";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { AdminComponent } from "./admin/admin.component";
import { LogueoModule } from "../logueo/logueo.module";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { UpdateInfoPersonalComponent } from "./update-info-personal/update-info-personal.component";
import { DialogExitComponent } from "./dialog-exit/dialog-exit.component";
import { IdentificacionComponent } from "./formularios/identificacion/identificacion.component";
import { InfoContactoComponent } from "./formularios/info-contacto/info-contacto.component";
import { EmpresarialComponent } from "./formularios/empresarial/empresarial.component";
import { FinancieroComponent } from "./formularios/financiero/financiero.component";
import { OperativoComponent } from "./formularios/operativo/operativo.component";
import { ComercialComponent } from "./formularios/comercial/comercial.component";
import { DocumentalComponent } from "./formularios/documental/documental.component";
import { AceptacionComponent } from "./formularios/aceptacion/aceptacion.component";
import { SidenavRoutes } from "./sidenav.routing";
import { JwtModule } from "@auth0/angular-jwt";
import { NgxSpinnerModule } from "ngx-spinner";
import { FormularioService } from "./formularios/formulario.service";
import { ApiEndpoints } from "../logueo/api.endpoints";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { AngularFileUploaderModule } from "./formularios/documental/angular-file-uploader/src/lib/angular-file-uploader.module";
import { FileSaverModule } from "ngx-filesaver";
import { DialogBoxComponent } from "./formularios/financiero/dialog-box/dialog-box.component";
import { OnlyNumbersDirective } from "../common/directives/only-numbers/only-numbers.directive";
import { RucValidatorDirective } from "../common/directives/valida-ruc/valida-ruc.directive";

export function tokenGetter() {
  return sessionStorage.getItem("token");
}

@NgModule({
  exports: [LogueoModule],

  imports: [
    CommonModule,
    RouterModule.forChild(SidenavRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,

    NgxSpinnerModule,

    LogueoModule,

    AngularFileUploaderModule,

    FileSaverModule,

    JwtModule.forRoot({
      config: {
        headerName: "auth",
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:3000", "foo.com", "bar.com"],
        blacklistedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),

    BsDatepickerModule.forRoot(),
  ],
  providers: [ApiEndpoints, FormularioService],
  declarations: [
    AdminComponent,
    DialogExitComponent,
    ChangePasswordComponent,
    UpdateInfoPersonalComponent,
    IdentificacionComponent,
    InfoContactoComponent,
    EmpresarialComponent,
    FinancieroComponent,
    OperativoComponent,
    ComercialComponent,
    DocumentalComponent,
    AceptacionComponent,
    DialogBoxComponent,

    OnlyNumbersDirective,
    RucValidatorDirective,
  ],
})
export class SidenavModule {}
