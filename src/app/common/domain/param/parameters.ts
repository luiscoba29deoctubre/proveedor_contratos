export class Parameter {
  constructor(public id?: number, public name?: string) {}
}

export class ParameterContribuyente {
  constructor(
    public id?: number,
    public idtipopersona?: number,
    public name?: string
  ) {}
}

export class ParameterCategoria {
  constructor(
    public id?: number,
    public idactividad?: number,
    public name?: string
  ) {}
}

export class ParameterCatalogoCategoria {
  constructor(
    public id?: number,
    public idcategoria?: number,
    public name?: string
  ) {}
}
