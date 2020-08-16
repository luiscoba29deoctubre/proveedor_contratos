import { IdentificacionDto } from "./../common/dtos/form/IdentificacionDto";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { formularios } from "../dashboard/indexedDB";

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
        for (let index in vector) {
          // console.log("index[posicion]", vector[index].name);
          this.addParameterToDB(key, vector[index].id, vector[index].name);
        }
      }
    }
  };

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
    this.dbService
      .add("identificacionDto", {
        rucrise: i.rucrise,
        nombrerazonsocial: i.nombrerazonsocial,
        nombrecomercial: i.nombrecomercial,
        idtipopersona: i.idtipopersona,
      })
      .then(
        () => {
          // Do something after the value was added
          console.log("exito se llena store identificacionDto");
        },
        (error) => {
          console.log(error);
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
  };
}
