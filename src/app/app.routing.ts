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
          import("./items-sidenav/sidenav.module").then((m) => m.SidenavModule),
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
