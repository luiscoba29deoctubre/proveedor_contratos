import { NgxIndexedDBService } from "ngx-indexed-db";
import { ParamPregunta, ParamRespuesta } from "../../common/dtos/parameters";
import { storageList } from "./indexedDB";

// manejaremos la bd
export class ProcessIDB {
  constructor(private dbService: NgxIndexedDBService) {}

  fillingParameters = (allParameters) => {
    this.clearIndexedDB(); // para borrar los stores del indexedDB

    this.addLstActividadDto(
      "lstActividadDto",
      allParameters["lstActividadDto"]
    );

    this.storeLstCantonDto("lstCantonDto", allParameters["lstCantonDto"]);

    this.storeLstCatalogoCategoriaDto(
      "lstCatalogocategoriaDto",
      allParameters["lstCatalogocategoriaDto"]
    );

    this.storeLstCategoriaDto(
      "lstCategoriaDto",
      allParameters["lstCategoriaDto"]
    );

    this.addLstPaisDto("lstPaisDto", allParameters["lstPaisDto"]);

    this.storeLstProvinciaDto(
      "lstProvinciaDto",
      allParameters["lstProvinciaDto"]
    );

    this.addLstTipoPersonaDto(
      "lstTipoPersonaDto",
      allParameters["lstTipoPersonaDto"]
    );

    this.addLstTipoProveedorDto(
      "lstTipoProveedorDto",
      allParameters["lstTipoProveedorDto"]
    );

    this.storeLstTipocontribuyenteDto(
      "lstTipocontribuyenteDto",
      allParameters["lstTipocontribuyenteDto"]
    );

    this.storeLstPreguntaDto("lstPreguntaDto", allParameters["lstPreguntaDto"]);

    this.storeLstRespuestaDto(
      "lstRespuestaDto",
      allParameters["lstRespuestaDto"]
    );

    this.addLstDocumentoDto(
      "lstDocumentoDto",
      allParameters["lstDocumentoDto"]
    );

    this.storeLstParroquiaDto(
      "lstParroquiaDto",
      allParameters["lstParroquiaDto"]
    );

    this.storeLstCuentaDto("lstCuentaDto", allParameters["lstCuentaDto"]);
  };

  addLstTipoProveedorDto = (key, vector) => {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.addParameterToDB(key, vector[index].id, vector[index].name);
    }
  };

  addLstActividadDto = (key, vector) => {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.addParameterToDB(key, vector[index].id, vector[index].name);
    }
  };

  addLstTipoPersonaDto = (key, vector) => {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.addParameterToDB(key, vector[index].id, vector[index].name);
    }
  };

  addLstDocumentoDto = (store, vector) => {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          name: vector[index].name,
          numero: vector[index].numero,
        })
        .then(
          () => {
            // Do something after the value was added
          },
          (error) => {
            console.log(store, error);
          }
        );
    }
  };

  addLstPaisDto = (key, vector) => {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.addParameterToDB(key, vector[index].id, vector[index].name);
    }
  };

  storeLstRespuestaDto(store, vector: ParamRespuesta[]): void {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          idpregunta: vector[index].idpregunta,
          name: vector[index].name,
          idtipoperfil: vector[index].idtipoperfil,
        })
        .then(
          () => {
            // Do something after the value was added
          },
          (error) => {
            console.log(store, error);
          }
        );
    }
  }

  storeLstPreguntaDto(store, vector: ParamPregunta[]): void {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          name: vector[index].name,
          idtipoperfil: vector[index].idtipoperfil,
        })
        .then(
          () => {
            // Do something after the value was added
          },
          (error) => {
            console.log(store, error);
          }
        );
    }
  }
  storeLstCantonDto(store, vector): void {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          idprovincia: vector[index].idprovincia,
          name: vector[index].name,
        })
        .then(
          () => {
            // Do something after the value was added
          },
          (error) => {
            console.log(store, error);
          }
        );
    }
  }

  storeLstTipocontribuyenteDto(store, vector): void {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          idtipopersona: vector[index].idtipopersona,
          name: vector[index].name,
        })
        .then(
          () => {
            // Do something after the value was added
          },
          (error) => {
            console.log(store, error);
          }
        );
    }
  }
  storeLstCategoriaDto(store, vector): void {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          idactividad: vector[index].idactividad,
          name: vector[index].name,
        })
        .then(
          () => {
            // Do something after the value was added
          },
          (error) => {
            console.log(store, error);
          }
        );
    }
  }
  storeLstCatalogoCategoriaDto(store, vector): void {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          idcategoria: vector[index].idcategoria,
          name: vector[index].name,
        })
        .then(
          () => {
            // Do something after the value was added
          },
          (error) => {
            console.log(store, error);
          }
        );
    }
  }

  storeLstParroquiaDto(store, vector): void {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          idcanton: vector[index].idcanton,
          name: vector[index].name,
        })
        .then(
          () => {
            // Do something after the value was added
          },
          (error) => {
            console.log(store, error);
          }
        );
    }
  }

  storeLstCuentaDto(store, vector): void {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          name: vector[index].name,
          idtiporatio: vector[index].idtiporatio,
          idtipopersona: vector[index].idtipopersona,
        })
        .then(
          () => {
            // Do something after the value was added
          },
          (error) => {
            console.log(store, error);
          }
        );
    }
  }

  storeLstProvinciaDto(store, vector): void {
    // tslint:disable-next-line: forin
    for (const index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          idpais: vector[index].idpais,
          name: vector[index].name,
        })
        .then(
          () => {
            // Do something after the value was added
          },
          (error) => {
            console.log(store, error);
          }
        );
    }
  }

  addParameterToDB(store, id, name): void {
    this.dbService.add(store, { id: id, name: name }).then(
      () => {
        // Do something after the value was added
      },
      (error) => {
        console.log(store, error);
      }
    );
  }

  clearIndexedDB = () => {
    storageList.forEach((store) => {
      this.dbService.clear(store).then(
        () => {
          // Do something after clear
        },
        (error) => {
          console.log(store, error);
        }
      );
    });
  };
}
