import { Routes } from "@angular/router";
import { AuthGuardService } from "../common/services/auth/auth-guard.service";
import { AdminComponent } from "./admin/admin.component";
import { AceptacionComponent } from "./formularios/aceptacion/aceptacion.component";
import { ComercialComponent } from "./formularios/comercial/comercial.component";
import { DocumentalComponent } from "./formularios/documental/documental.component";
import { EmpresarialComponent } from "./formularios/empresarial/empresarial.component";
import { FinancieroComponent } from "./formularios/financiero/financiero.component";
import { IdentificacionComponent } from "./formularios/identificacion/identificacion.component";
import { InfoContactoComponent } from "./formularios/info-contacto/info-contacto.component";
import { OperativoComponent } from "./formularios/operativo/operativo.component";

export const SidenavRoutes: Routes = [
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "identificacion",
    component: IdentificacionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "infocontacto",
    component: InfoContactoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "empresarial",
    component: EmpresarialComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "financiero",
    component: FinancieroComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "operativo",
    component: OperativoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "comercial",
    component: ComercialComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "documental",
    component: DocumentalComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "aceptacion",
    component: AceptacionComponent,
    canActivate: [AuthGuardService],
  },
];
