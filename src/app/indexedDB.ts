import { DBConfig } from "ngx-indexed-db";
export const dbConfig: DBConfig = {
  name: "Providers",
  version: 1,
  /*
        lstTipoPersonaDto,
        lstTipoProveedorDto,
        lstTipocontribuyenteDto,
        lstActividadDto,
        lstCategoriaDto,
        lstCatalogocategoriaDto,
  */
  objectStoresMeta: [
    {
      store: "lstTipoPersonaDto",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: "lstTipoProveedorDto",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: "lstTipocontribuyenteDto",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: "lstActividadDto",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: "lstCategoriaDto",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: "lstCatalogocategoriaDto",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    // cada uno de los formularios
    {
      store: "lstCatalogocategoriaDto",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
  ],
};
