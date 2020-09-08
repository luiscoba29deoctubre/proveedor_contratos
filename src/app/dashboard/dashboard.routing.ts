import { Routes } from "@angular/router";
import { AuthGuardService } from "../common/services/auth/auth-guard.service";
import { DashboardComponent } from "./dashboard.component";

export const DashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AuthGuardService],
  },
];
