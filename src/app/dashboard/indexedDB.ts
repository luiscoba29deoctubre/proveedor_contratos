import { DBConfig } from "ngx-indexed-db";

export const formularios = ["identificacionDto"];
export const listas = [
  "lstTipoPersonaDto",
  "lstTipoProveedorDto",
  "lstTipocontribuyenteDto",
  "lstActividadDto",
  "lstCategoriaDto",
  "lstCatalogocategoriaDto",
];

export const dbConfig: DBConfig = {
  name: "Providers",
  version: 1,
  objectStoresMeta: [
    {
      store: listas[0],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: listas[1],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: listas[2],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        {
          name: "idtipopersona",
          keypath: "idtipopersona",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: listas[3],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: listas[4],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: listas[5],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    // cada uno de los formularios
    {
      store: formularios[0],
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        {
          name: "idinformacioncontacto",
          keypath: "idinformacioncontacto",
          options: { unique: false },
        },
        {
          name: "idtipopersona",
          keypath: "idtipopersona",
          options: { unique: false },
        },
        {
          name: "idtipoproveedor",
          keypath: "idtipoproveedor",
          options: { unique: false },
        },

        { name: "rucrise", keypath: "rucrise", options: { unique: false } },

        {
          name: "nombrerazonsocial",
          keypath: "nombrerazonsocial",
          options: { unique: false },
        },
        {
          name: "nombrecomercial",
          keypath: "nombrecomercial",
          options: { unique: false },
        },
      ],
    },
  ],
};
