import { ParamRespuesta, ParamRespuestaSeleccionada } from '../parameters';

export class EmpresarialDto {
  constructor(
    public idtipoperfil?: number,

    public fechaaperturaruc?: string,
    public actividadeconomicaprincipal?: string,
    public actividadeconomicasecundaria?: string,

    public lstRespuestaSeleccionada?: ParamRespuestaSeleccionada[]
  ) {}
}


