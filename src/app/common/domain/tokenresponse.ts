/**
 * Token de respuesta del servidor
 */
export class TokenResponse {
  constructor(
    public message?: string,
    public token?: string
  ) {}
}
