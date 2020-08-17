export class IdentificacionDto {
  constructor(
    public id?: number,
    public estado?: boolean,
    public correo?: string,
    public rucrise?: string,
    public idtipopersona?: number,
    public nombrecomercial?: string,
    public nombrerazonsocial?: string
  ) {}
}
