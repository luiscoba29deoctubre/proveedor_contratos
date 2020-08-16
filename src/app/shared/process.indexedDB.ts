import { NgxIndexedDBService } from "ngx-indexed-db";

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
          this.addElementsToDB(key, vector[index].id, vector[index].name);
        }
      }
    }
  };

  addElementsToDB(store, id, name): void {
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

  fillingForm = (objetoPadre: Object) => {
    const arrayNombre = Object.getOwnPropertyNames(objetoPadre);
    let store: string = objetoPadre.toString();
    store = arrayNombre[0];

    for (const key in objetoPadre) {
      if (objetoPadre.hasOwnProperty(key)) {
        const objHijo = objetoPadre[key];
        for (let index in objHijo) {
          this.addElementsToDB(store, objHijo[index].id, objHijo[index].name);
        }
      }
    }
  };

  /* se lo intento, pero no funcionó automatizar la creacion de tablas en IDB
  createSchema(store: string) {
    const storeSchema: ObjectStoreMeta = {
      store: store,
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    };
  }*/
}
