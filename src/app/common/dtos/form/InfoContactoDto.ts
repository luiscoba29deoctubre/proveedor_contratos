import {
  ParamCanton, ParamPais, ParamParroquia,
  ParamProvincia
} from '../parameters';
export class InfoContactoDto {
  constructor(
    public direccion?: string,
    public telefono?: string,
    public celular?: string,
    public mailproveedor?: string,
    public contactocomercial?: string,
    public telefonocontactocomercial?: string,
    public celular1?: string,
    public mail1?: string,
    public celular2?: string,
    public mail2?: string,

    public pais?: ParamPais,
    public provincia?: ParamProvincia,
    public canton?: ParamCanton,
    public parroquia?: ParamParroquia
  ) {}
}
