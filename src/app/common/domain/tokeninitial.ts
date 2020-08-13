import { IdentificacionDto } from "../DTO/form/IdentificacionDto";

/**
 * Token de respuesta del servidor
 */
export class TokenInitial {
  constructor(
    public message?: string,
    public token?: string,
    public identificacionDto?: IdentificacionDto
  ) {}
}
