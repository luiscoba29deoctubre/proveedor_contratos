import { Routes } from "@angular/router";

import { FullComponent } from "./layouts/full/full.component";
import { RegisterComponent } from "./logueo/register/register.component";
import { ForgotPassComponent } from "./logueo/forgot-pass/forgot-pass.component";

export const AppRoutes: Routes = [
  {
    path: "",
    // component: FullComponent,
    children: [
      {
        path: "",
        redirectTo: "/login",
        pathMatch: "full",
      },
      {
        path: "",
        component: FullComponent,
        loadChildren: () =>
          import("./material-component/material.module").then(
            (m) => m.MaterialComponentsModule
          ),
      },
      {
        path: "login",
        loadChildren: () =>
          import("./logueo/logueo.module").then((m) => m.LogueoModule),
      },
      {
        path: "dashboard",
        component: FullComponent,
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      /*{
        path: "",
        component: FullComponent,
        loadChildren: () =>
          import("./material-component/formularios/formularios.module").then((m) => m.FormulariosModule),
      },*/
    ],
  },
  {
    path: "registro",
    component: RegisterComponent,
  },
  {
    path: "olvido-clave",
    component: ForgotPassComponent,
  },
];
