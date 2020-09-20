export class Parameter {
  constructor(public id?: number, public name?: string) {}
}

export class ParamPais {
  constructor(public id?: number, public code?: string, public name?: string) { }
}


export class ParamContribuyente {
  constructor(
    public id?: number,
    public idtipopersona?: number,
    public name?: string
  ) {}
}

export class ParamCategoria {
  constructor(
    public id?: number,
    public idactividad?: number,
    public name?: string
  ) {}
}

export class ParamCatalogoCategoria {
  constructor(
    public id?: number,
    public idcategoria?: number,
    public name?: string
  ) {}
}

export class ParamProvincia {
  constructor(
    public id?: number,
    public idpais?: number,
    public name?: string
  ) {}
}

export class ParamCanton {
  constructor(
    public id?: number,
    public idprovincia?: number,
    public name?: string
  ) {}
}

export class ParamParroquia {
  constructor(
    public id?: number,
    public idcanton?: number,
    public name?: string
  ) {}
}

export class ParamAllQuestions {
  constructor(
    public id?: number,
    public question?: string,
    public answers?: ParamRespuestaSeleccionada[]
  ) {}
}

export class ParamPregunta {
  constructor(
    public id?: number,
    public name?: string,
    public idtipoperfil?: number
  ) {}
}

export class ParamRespuesta {
  constructor(
    public id?: number,
    public idpregunta?: number,
    public name?: string,
    public idtipoperfil?: number
  ) {}
}

export class ParamRespuestaSeleccionada {
  constructor(
    public idrespuestaseleccionada?: number,
    public idpregunta?: number,
    public idrespuesta?: number,
    public name?: string
  ) {}
}

export class ParamDocumento {
  constructor(
    public id?: number,
    public name?: string,
    public numero?: number,
    public lstDocumentoPerfilDocumental?: ParamDocumentoPerfilDocumental[]
  ) {}
}

export class ParamCuenta {
  constructor(
    public id?: number,
    public name?: string,
    public idtiporatio?: number,
    public idtipopersona?: number,
    public lstDocumentoPerfilDocumental?: ParamDocumentoPerfilDocumental[]
  ) {}
}

export class ParamDocumentoPerfilDocumental {
  constructor(
    public id?: number,
    public iddocumento?: number,
    public name?: string,
    public size?: number
  ) {}
}

export class ParamPerfilFinanciero {
  constructor(
    public idcuenta?: number,
    public cuenta?: string,
    public resultadoPenultimo?: number,
    public resultadoUltimo?: number
  ) {}
}
