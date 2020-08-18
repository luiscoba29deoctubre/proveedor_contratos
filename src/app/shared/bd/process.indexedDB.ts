import { IdentificacionDto } from "../../common/dtos/form/IdentificacionDto";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { formularios, listas } from "./indexedDB";

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
          id: vector[index].id,
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
          id: vector[index].id,
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

  fillingIdentificacion = (i: IdentificacionDto) => {
    this.dbService.clear("identificacionDto").then(
      () => {
        // Do something after clear
        console.log("se elimina identificacionDto");
      },
      (error) => {
        console.log("clear fillingIdentificacion", error);
      }
    );

    this.dbService
      .add("identificacionDto", {
        id: i.id,
        idinformacioncontacto: i.idinformacioncontacto,
        idtipopersona: i.idtipopersona,
        idtipoproveedor: i.idtipoproveedor,
        idtipocontribuyente: i.idtipocontribuyente,
        rucrise: i.rucrise,
        nombrerazonsocial: i.nombrerazonsocial,
        nombrecomercial: i.nombrecomercial,
        idactividad: i.idactividad,
        idcategoria: i.idcategoria,
        idcatalogocategoria: i.idcatalogocategoria,
      })
      .then(
        () => {
          // Do something after the value was added
          console.log("exito se llena store identificacionDto");
        },
        (error) => {
          console.log("fillingIdentificacion " + error);
        }
      );
  };

  updatingIdentificacion = (i: IdentificacionDto) => {
    this.dbService
      .update("identificacionDto", {
        id: i.id,
        idinformacioncontacto: i.idinformacioncontacto,
        idtipopersona: i.idtipopersona,
        idtipoproveedor: i.idtipoproveedor,
        idtipocontribuyente: i.idtipocontribuyente,
        rucrise: i.rucrise,
        nombrerazonsocial: i.nombrerazonsocial,
        nombrecomercial: i.nombrecomercial,
        idactividad: i.idactividad,
        idcategoria: i.idcategoria,
        idcatalogocategoria: i.idcatalogocategoria,
      })
      .then(
        () => {
          // Do something after the value was added
          console.log("exito se llena store identificacionDto");
        },
        (error) => {
          console.log("fillingIdentificacion " + error);
        }
      );
  };

  clearIndexedDB = () => {
    console.log("entra en clear");
    formularios.forEach((store) => {
      this.dbService.clear(store).then(
        () => {
          // Do something after clear
        },
        (error) => {
          console.log(error);
        }
      );
    });

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
