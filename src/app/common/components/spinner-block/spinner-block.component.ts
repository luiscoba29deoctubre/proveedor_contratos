import { Component, OnInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router'

import { SpinnerBlockService } from './spinner-block.service'

/**
 * Componente que bloquea la interfaz de usuario mientras se realizan acciones en el servidor
 */
@Component({
  selector: 'app-spinner-block',
  templateUrl: './spinner-block.component.html',
  styleUrls: ['./spinner-block.component.css']
})
export class SpinnerBlockComponent implements OnInit {

  /** Flag para el manejo del estado del spinner */
  public active: boolean;

  /**
   * Constructor del Componente {@link SpinnerBlockComponent}
   * 
   * @param spinnerBlock Servicio para el control del estado del spinner
   */
  constructor(spinnerBlock: SpinnerBlockService) {
    spinnerBlock.status.subscribe((status: boolean) => {
      this.active = status;
    });
  }

  /**
   * Método que se ejecuta cuando se inicia el Componente
   */
  ngOnInit() {
  }


}
