/**
 * Domain del entity Usuario
 */
export class Usuario {
  constructor(
    public usuario?: string,
    public nombre?: string,
    public apellidos?: string,
    public correo?: string,
    public telefono?: string
  ) {}
}
