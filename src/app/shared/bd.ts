import { NgxIndexedDBService, DBConfig } from "ngx-indexed-db";
import { ObjectStoreMeta } from "ngx-indexed-db/lib/ngx-indexed-db";
import { Parameter } from "../common/domain/param/parameter";
// manejaremos la bd
export class Base {
  constructor(private dbService: NgxIndexedDBService, allParameters) {
    /* allParameters.forEach((element) => {
      console.log("cada uno de los elementos de allParameters", element);
    });*/

    dbConfig;

    console.log("allParameters bdd", allParameters);

    this.dbService.getByKey("people", 1).then(
      (person) => {
        console.log(person);
      },
      (error) => {
        console.log(error);
      }
    );

    // tslint:disable-next-line: forin
    for (let key in allParameters) {
      if (allParameters.hasOwnProperty(key)) {
        console.log(key + " -> " + allParameters[key]); //tomado del sistema 'responsable'
        this.createSchema(key);
        let vector = allParameters[key];
        // tslint:disable-next-line: forin
        for (let index in vector) {
          //console.log("index[posicion]", vector[index].name);
          this.addElementsToDB(key, vector[index].id, vector[index].name);
        }
      }
    }

    this.dbService.getByIndex("people", "name", "Luis").then(
      (person) => {
        console.log("imprime p", person);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createSchema(store: string) {
    const storeSchema: ObjectStoreMeta = {
      store: store,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    };
    this.dbService.createObjectStore(storeSchema);
  }

  addElementsToDB(store, id, name): void {
    this.dbService.add(store, { id: id, name: name }).then(
      () => {
        // Do something after the value was added
        console.log("se ingresa mi nombre");
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

export let dbConfig: DBConfig = {
  name: "Providers",
  version: 1,
  objectStoresMeta: [],
};
