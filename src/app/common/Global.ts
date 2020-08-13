import { Parameter } from "./domain/param/parameter";
import { IdentificacionDto } from './DTO/form/IdentificacionDto';
/**
 * Archivo global para almacenar la informacion de los componentes
 * y no hacer llamadas Get, cada vez que ingresas al componente
 */

export class Global {
  static identificacion: IdentificacionDto = new IdentificacionDto();

  static lstTipoPersona: any;
}
