import "hammerjs";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutes } from "./dashboard.routing";
import { JwtModule } from "@auth0/angular-jwt";
import { ParamService } from "./param.service";
import { ApiEndpoints } from "../logueo/api.endpoints";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { dbConfig } from '../shared/bd/indexedDB';
import { NgxIndexedDBModule } from 'ngx-indexed-db';

export function tokenGetter() {
  return sessionStorage.getItem("token");
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    //NgxIndexedDBModule.forRoot(dbConfig),

    JwtModule.forRoot({
      config: {
        headerName: "auth",
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:3000", "foo.com", "bar.com"],
        blacklistedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
  ],
  declarations: [DashboardComponent],
  providers: [ApiEndpoints, ParamService],
})
export class DashboardModule {}
