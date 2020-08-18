import { IdentificacionDto } from "./../common/dtos/form/IdentificacionDto";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { formularios, listas } from "../dashboard/indexedDB";

// manejaremos la bd
export class ProcessIDB {
  constructor(private dbService: NgxIndexedDBService) {}

  fillingParameters = (allParameters) => {
    // console.log("allParameters bdddddd", allParameters);
    for (let key in allParameters) {
      if (allParameters.hasOwnProperty(key)) {
        // console.log(key + " -> " + allParameters[key]); // tomado del sistema 'responsable'
        //   this.createSchema(key); // no vale crear schemas
        let vector = allParameters[key];
        // tslint:disable-next-line: forin
        if (key == "lstTipocontribuyenteDto") {
          // tslint:disable-next-line: forin
          for (let index in vector) {
            // console.log("index[posicion]", vector[index].name);
            this.addContribuyente(
              key,
              vector[index].id,
              vector[index].idtipopersona,
              vector[index].name
            );
          }
        } else {
          // tslint:disable-next-line: forin
          for (let index in vector) {
            // console.log("index[posicion]", vector[index].name);
            this.addParameterToDB(key, vector[index].id, vector[index].name);
          }
        }
      }
    }
  };

  addContribuyente(store, id, idtipopersona, name): void {
    this.dbService
      .add(store, { id: id, idtipopersona: idtipopersona, name: name })
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
    console.log("i.rucriseeee", i.rucrise);
    this.dbService
      .add("identificacionDto", {
        id: i.id,
        //    idinformacioncontacto: i.idinformacioncontacto,
        //   id coooontribuyente: i.id coooontribuyente,
        idtipopersona: i.idtipopersona,
        idtipoproveedor: i.idtipoproveedor,
        rucrise: i.rucrise,
        nombrerazonsocial: i.nombrerazonsocial,
        nombrecomercial: i.nombrecomercial,
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
        //    idinformacioncontacto: i.idinformacioncontacto,
        //   id coooontribuyente: i.id coooontribuyente,
        idtipopersona: i.idtipopersona,
        idtipoproveedor: i.idtipoproveedor,
        rucrise: i.rucrise,
        nombrerazonsocial: i.nombrerazonsocial,
        nombrecomercial: i.nombrecomercial,
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
