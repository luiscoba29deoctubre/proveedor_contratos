import { NgxIndexedDBService, DBConfig } from "ngx-indexed-db";
import { ObjectStoreMeta } from "ngx-indexed-db/lib/ngx-indexed-db";
// manejaremos la bd
export class Base {
  constructor(private dbService: NgxIndexedDBService, allParameters) {
    /* allParameters.forEach((element) => {
      console.log("cada uno de los elementos de allParameters", element);
    });*/

    const storeSchema: ObjectStoreMeta = {
      store: "people",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "id", keypath: "id", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
        { name: "email", keypath: "email", options: { unique: false } },
      ],
    };
    this.dbService.createObjectStore(storeSchema);

    console.log("allParameters bdd", allParameters);

    // tslint:disable-next-line: forin
    for (let key in allParameters) {
      console.log(key + " -> " + allParameters[key]);
      let vector = allParameters[key];
      // tslint:disable-next-line: forin
      for (let index in vector) {
        console.log("index[posicion]", vector[index].name);
      }
    }

    this.dbService.add("people", { id: 1000, name: "Luis", email: "coba" }).then(
      () => {
        // Do something after the value was added
        console.log("se ingresa mi nombre");
      },
      (error) => {
        console.log(error);
      }
    );

    this.dbService.getByIndex("people", "name", "Luis").then(
      (person) => {
        console.log("imprime p", person);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
