import { Rol } from "./rol";

/**
 * Mapeo del response después de hacer login
 */
export class Token {
  constructor(
    public usuario?: string,
    public nombre?: string,
    public apellidos?: string,
    public correo?: string,
    public telefono?: string,
    public rol?: Rol,
    public token?: string,
    public idproveedor?: string
  ) {}
}
