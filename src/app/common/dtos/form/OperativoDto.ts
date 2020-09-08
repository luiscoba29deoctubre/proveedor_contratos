import { ParamRespuestaSeleccionada } from "../parameters";

export class OperativoDto {
  constructor(
    public idtipoperfil?: number,

    public lstRespuestaSeleccionada?: ParamRespuestaSeleccionada[]
  ) {}
}
