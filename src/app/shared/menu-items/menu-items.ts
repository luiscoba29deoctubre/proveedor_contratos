import { Injectable } from "@angular/core";
import { NgxIndexedDBService } from "ngx-indexed-db";

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  /*  {
    state: "admin",
    name: "Administración",
    type: "link",
    icon: "av_timer",
  },*/
  // { state: "dashboard", name: "Dashboard", type: "link", icon: "av_timer" },
  {
    state: "identificacion",
    name: "Identificación",
    type: "link",
    icon: "av_timer",
  },
  {
    state: "infocontacto",
    name: "Informacion contacto",
    type: "link",
    icon: "av_timer",
  },
  {
    state: "empresarial",
    name: "Empresarial",
    type: "link",
    icon: "av_timer",
  },
  {
    state: "financiero",
    name: "Financiero",
    type: "link",
    icon: "av_timer",
  },
  {
    state: "operativo",
    name: "Operativo",
    type: "link",
    icon: "av_timer",
  },
  {
    state: "comercial",
    name: "Comercial",
    type: "link",
    icon: "av_timer",
  },
  {
    state: "documental",
    name: "Documental",
    type: "link",
    icon: "av_timer",
  },
  {
    state: "aceptacion",
    name: "Aceptacion",
    type: "link",
    icon: "av_timer",
  },
];

@Injectable()
export class MenuItems {
  constructor() {}

  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
