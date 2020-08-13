import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/share";

/**
 * Servicio para el control del spinner
 */
@Injectable({
  providedIn: "root",
})
export class SpinnerBlockService {
  /** Estado del spinner */
  public status: Subject<boolean> = new Subject<boolean>();
  /** Controlador del estado del spinner */
  private _active: boolean = false;

  /**
   * Constructor del Servicio {@link SpinnerBlockService}
   */
  constructor() {}

  /**
   * Obtiene el estado del spinner
   */
  public get active(): boolean {
    return this._active;
  }

  /**
   * Setea el estado del spinner
   */
  public set active(v: boolean) {
    this._active = v;
    this.status.next(v);
  }

  /**
   * Muestra el spinner
   */
  public start(): void {
    this.active = true;
  }

  /**
   * Oculta el spinner
   */
  public stop(): void {
    this.active = false;
  }
}
