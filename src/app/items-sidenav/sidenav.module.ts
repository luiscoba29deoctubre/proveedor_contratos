import "hammerjs";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";

import { DemoMaterialModule } from "../demo-material-module";
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
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return sessionStorage.getItem("token");
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SidenavRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,

    LogueoModule,

    JwtModule.forRoot({
      config: {
        headerName: "auth",
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:3000", "foo.com", "bar.com"],
        blacklistedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
  ],
  providers: [],
  entryComponents: [],
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SidenavModule {}
