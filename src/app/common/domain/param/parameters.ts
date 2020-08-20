export class Parameter {
  // con id se maneja persona, contribuyente, proveedor
  constructor(public id?: number, public code?: number, public name?: string) {}
}


export class ParameterCode {
  // con code se maneja categorias, actividad, catalogoCategoria
  constructor(public code?: number, public name?: string) {}
}

export class ParameterContribuyente {
  constructor(
    public id?: number,
    public idtipopersona?: number,
    public name?: string
  ) {}
}

export class ParameterActividad {
  constructor(public code?: number, public id?: number, public name?: string) {}
}
export class ParameterCategoria {
  constructor(
    public code?: number,
    public id?: number,
    public idactividad?: number,
    public name?: string
  ) {}
}

export class ParameterCatalogoCategoria {
  constructor(
    public code?: number,
    public id?: number,
    public idcategoria?: number,
    public name?: string
  ) {}
}
