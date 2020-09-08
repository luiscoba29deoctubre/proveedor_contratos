import { DBConfig } from "ngx-indexed-db";

export const storageList = [
  // identificacion
  "lstTipoPersonaDto", // 0
  "lstTipoProveedorDto", // 1
  "lstTipocontribuyenteDto", // 2
  "lstActividadDto", // 3
  "lstCategoriaDto", // 4
  "lstCatalogocategoriaDto", // 5
  // info-contacto
  "lstPaisDto", // 6
  "lstProvinciaDto", // 7
  "lstCantonDto", // 8
  "lstParroquiaDto", // 9
  // empresarial
  "lstRespuestaDto", // 10
  "lstPreguntaDto", // 11
  // documental
  "lstDocumentoDto",
];

export const dbConfig: DBConfig = {
  name: "Providers",
  version: 1,
  objectStoresMeta: [
    {
      store: storageList[0],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: storageList[1],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: storageList[2],
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
      store: storageList[3],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: storageList[4],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        {
          name: "idactividad",
          keypath: "idactividad",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: storageList[5],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        {
          name: "idcategoria",
          keypath: "idcategoria",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    // info-contacto
    {
      store: storageList[6],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        {
          name: "idcategoria",
          keypath: "idcategoria",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },

    {
      store: storageList[7],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        {
          name: "idpais",
          keypath: "idpais",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: storageList[8],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        {
          name: "idprovincia",
          keypath: "idprovincia",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: storageList[9],
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        {
          name: "idcanton",
          keypath: "idcanton",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    // empresarial
    {
      store: storageList[10], // respuesta
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        {
          name: "idpregunta",
          keypath: "idpregunta",
          options: { unique: false },
        },
        {
          name: "idtipoperfil",
          keypath: "idtipoperfil",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: storageList[11], // pregunta
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        {
          name: "idtipoperfil",
          keypath: "idtipoperfil",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: storageList[12], // documento
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
        { name: "numero", keypath: "numero", options: { unique: false } },
      ],
    },
  ],
};
