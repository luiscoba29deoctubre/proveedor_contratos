import { NgxIndexedDBService } from "ngx-indexed-db";

// manejaremos la bd
export class FillingDataBase {
  constructor(private dbService: NgxIndexedDBService, allParameters) {
    //console.log("allParameters bdd", allParameters);

    // tslint:disable-next-line: forin
    for (let key in allParameters) {
      if (allParameters.hasOwnProperty(key)) {
        console.log(key + " -> " + allParameters[key]); //tomado del sistema 'responsable'
        //   this.createSchema(key); // no vale crear schemas
        let vector = allParameters[key];
        // tslint:disable-next-line: forin
        for (let index in vector) {
          //console.log("index[posicion]", vector[index].name);
          this.addElementsToDB(key, vector[index].id, vector[index].name);
        }
      }
    }
  }

  addElementsToDB(store, id, name): void {
    this.dbService.add(store, { id: id, name: name }).then(
      () => {
        // Do something after the value was added
        console.log("se llena store ", store);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /*createSchema(store: string) {
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
