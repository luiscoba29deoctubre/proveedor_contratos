export class IdentificacionDto {
  constructor(
    public id?: number,
    public idinformacioncontacto?: number,
    public idtipopersona?: number,
    public idtipoproveedor?: number,
    public rucrise?: string,
    public nombrerazonsocial?: string,
    public nombrecomercial?: string,

    public estado?: boolean,
    public correo?: string
  ) {}
}
