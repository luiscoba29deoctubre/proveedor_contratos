import { Directive, Input } from "@angular/core";
import * as _ from "lodash";

/**
 * Directive utilizada para evitar el preventDefault en los <a> y su propiedad href con #
 */
@Directive({
  selector: "[href]",
  host: {
    "(click)": "preventDefault($event)",
  },
})
export class HrefDirective {
  /**
   * Constructor de la clase {@link HrefDirective}
   */
  constructor() {}

  /**
   * Propiedad href del componente <a>
   */
  @Input() href;

  /**
   * Valida si el elemento <a> tiene definida su propiedad href y si su valor es #, para lanzar el preventdefault()
   *
   * @param event Evento del <a>
   */
  preventDefault(event) {
    if (
      this.href.length == 0 ||
      this.href === "#" ||
      _.startsWith(this.href, "#")
    )
      event.preventDefault();
  }
}
