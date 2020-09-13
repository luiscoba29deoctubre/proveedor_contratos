import { ParamPerfilFinanciero } from '../parameters';
export class FinancieroDto {
  constructor(
    public anioActual?: number,
    public idTipoPersona?: number,
    public tipoPersona?: string,
    public lstCuentas?: ParamPerfilFinanciero[]
  ) { }
}

