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
    icon: "filter_1",
  },
  {
    state: "infocontacto",
    name: "Información contacto",
    type: "link",
    icon: "filter_2",
  },
  {
    state: "empresarial",
    name: "Empresarial",
    type: "link",
    icon: "filter_3",
  },
  {
    state: "financiero",
    name: "Financiero",
    type: "link",
    icon: "filter_4",
  },
  {
    state: "operativo",
    name: "Operativo",
    type: "link",
    icon: "filter_5",
  },
  {
    state: "comercial",
    name: "Comercial",
    type: "link",
    icon: "filter_6",
  },
  {
    state: "documental",
    name: "Documental",
    type: "link",
    icon: "filter_7",
  },
  {
    state: "aceptacion",
    name: "Aceptación",
    type: "link",
    icon: "filter_8",
  },
];

@Injectable()
export class MenuItems {
  constructor() {}

  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
