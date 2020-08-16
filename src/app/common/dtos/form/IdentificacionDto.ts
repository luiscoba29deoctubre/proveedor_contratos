export class IdentificacionDto {
  constructor(
    public estado?: boolean,
    public correo?: string,
    public rucrise?: string,
    public nombrerazonsocial?: string,
    public idtipopersona?: number,
    public nombrecomercial?: string
  ) {}
}
