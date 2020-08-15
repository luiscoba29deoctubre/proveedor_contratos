import { IdentificacionDto } from "../dtos/form/IdentificacionDto";

/**
 * El primer Token de respuesta del servidor
 */
export class TokenInitial {
  constructor(
    public token?: string,
    public identificacionDto?: IdentificacionDto
  ) {}
}
