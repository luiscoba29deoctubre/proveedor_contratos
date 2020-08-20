import { IdentificacionDto } from "../../common/dtos/form/IdentificacionDto";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { listas } from "./indexedDB";

// manejaremos la bd
export class ProcessIDB {
  constructor(private dbService: NgxIndexedDBService) {}

  fillingParameters = (allParameters) => {
    for (let key in allParameters) {
      if (allParameters.hasOwnProperty(key)) {
        let vector = allParameters[key];
        if (key === "lstTipocontribuyenteDto") {
          this.addContribuyente(key, vector);
        } else if (key === "lstCatalogocategoriaDto") {
          this.addCatalogoCategoria(key, vector);
        } else if (key === "lstCategoriaDto") {
          this.addCategoria(key, vector);
        } else if (key === "lstActividadDto") {
          this.addActividad(key, vector);
        } else {
          // tslint:disable-next-line: forin
          for (let index in vector) {
            this.addParameterToDB(key, vector[index].id, vector[index].name);
          }
        }
      }
    }
  };

  addContribuyente(store, vector): void {
    // tslint:disable-next-line: forin
    for (let index in vector) {
      this.dbService
        .add(store, {
          id: vector[index].id,
          idtipopersona: vector[index].idtipopersona,
          name: vector[index].name,
        })
        .then(
          () => {
            // Do something after the value was added
            console.log("se llena store ", store);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  addCategoria(store, vector): void {
    // tslint:disable-next-line: forin
    for (let index in vector) {
      this.dbService
        .add(store, {
          code: vector[index].id,
          idactividad: vector[index].idactividad,
          name: vector[index].name,
        })
        .then(
          () => {
            // Do something after the value was added
            console.log("se llena store ", store);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  addActividad(store, vector): void {
    // tslint:disable-next-line: forin
    for (let index in vector) {
      this.dbService
        .add(store, {
          code: vector[index].id,
          idactividad: vector[index].idactividad,
          name: vector[index].name,
        })
        .then(
          () => {
            // Do something after the value was added
            console.log("se llena store ", store);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  addCatalogoCategoria(store, vector): void {
    // tslint:disable-next-line: forin
    for (let index in vector) {
      this.dbService
        .add(store, {
          code: vector[index].id,
          idcategoria: vector[index].idcategoria,
          name: vector[index].name,
        })
        .then(
          () => {
            // Do something after the value was added
            console.log("se llena store ", store);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  addParameterToDB(store, id, name): void {
    this.dbService.add(store, { id: id, name: name }).then(
      () => {
        // Do something after the value was added
        // console.log("se llena store ", store);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  clearIndexedDB = () => {
    console.log("entra en clear");

    listas.forEach((store) => {
      console.log("entra a borrrar listas");
      this.dbService.clear(store).then(
        () => {
          // Do something after clear
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };
}
