export class IdentificacionDto {
  constructor(
    public estado?: boolean,

    public id?: number,
    public idinformacioncontacto?: number,
    public idtipopersona?: number,
    public idtipoproveedor?: number,
    public idtipocontribuyente?: number,
    public rucrise?: string,
    public nombrerazonsocial?: string,
    public nombrecomercial?: string,

    public lstActividades?: any,
  ) {}
}
