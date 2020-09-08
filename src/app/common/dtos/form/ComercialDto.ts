import { ParamRespuestaSeleccionada } from "../parameters";

export class ComercialDto {
  constructor(
    public idtipoperfil?: number,

    public lstRespuestaSeleccionada?: ParamRespuestaSeleccionada[]
  ) {}
}
