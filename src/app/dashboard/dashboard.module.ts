import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutes } from "./dashboard.routing";
import { JwtModule } from "@auth0/angular-jwt";

export function tokenGetter() {
  return sessionStorage.getItem("token");
}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(DashboardRoutes),

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
})
export class DashboardModule {}
