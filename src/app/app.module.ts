import { LocationStrategy, PathLocationStrategy } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NgxIndexedDBModule } from "ngx-indexed-db";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";
import { AppComponent } from "./app.component";
import { AppRoutes } from "./app.routing";
import { FullComponent } from "./layouts/full/full.component";
import { AppHeaderComponent } from "./layouts/full/header/header.component";
import { AppSidebarComponent } from "./layouts/full/sidebar/sidebar.component";
import { LogueoModule } from "./logueo/logueo.module";
import { MaterialModule } from "./material-module";
import { dbConfig } from "./shared/bd/indexedDB";
import { SharedModule } from "./shared/shared.module";
import { SpinnerComponent } from "./shared/spinner.component";

export function tokenGetter() {
  return sessionStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent,
  ],
  exports: [LogueoModule],

  imports: [
    ToastrModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    LogueoModule,
    NgxSpinnerModule,
    NgxIndexedDBModule.forRoot(dbConfig),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
