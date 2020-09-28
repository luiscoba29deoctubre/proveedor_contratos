import Swal from "sweetalert2";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { saveAs } from "file-saver";
import { NgxSpinnerService } from "ngx-spinner";
import { AceptacionDto } from "../../../common/dtos/form/AceptacionDto";
import { ApiEndpoints } from "../../../logueo/api.endpoints";
import { LoginService } from "../../../logueo/login/login.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "../formulario.service";

@Component({
  selector: "app-aceptacion",
  templateUrl: "./aceptacion.component.html",
  styleUrls: ["./aceptacion.component.css"],
})
export class AceptacionComponent implements OnInit {
  resetUpload: boolean;

  declaracion = "";
  autorizacion = "";

  aceptacionForm: FormGroup;

  constructor(
    private http: HttpClient,
    private endpoints: ApiEndpoints,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private formsService: FormularioService,
    private notifyService: NotificationService
  ) {
    this.initForm();
  }

  download_pdf = () => {
    console.log("dio click");

    this.http
      .get(this.endpoints.url_api_download_aceptacion, {
        responseType: "blob",
      }) // set response Type properly (it is not part of headers)
      .toPromise()
      .then((blob) => {
        saveAs(blob, "word.docx");
      })
      .catch((err) => console.error("download error = ", err));
  };

  ngOnInit() {
    this.spinner.show();
    this.loginService.checkExpirationToken();

    this.formsService.getAceptacion().subscribe(
      async (response) => {
        console.log("llega aceptacionDto", response);
        const aceptacionDto: AceptacionDto = response.body;

        this.autorizacion = aceptacionDto.autorizacion;
        this.declaracion = aceptacionDto.declaracion;

        this.spinner.hide();
      },
      (error) => {
        console.log("aqui error hay ", error);
        this.spinner.hide();
      }
    );
  }

  showToasterError(subtitulo, titulo) {
    this.notifyService.showError(subtitulo, titulo);
  }

  private initForm() {
    this.aceptacionForm = this.fb.group({
      aceptacion: [null, [Validators.required]],
      autorizacion: [null, [Validators.required]],
    });
  }

  docUpload(env) {
    console.log(env);
    console.log("entraaaaaaa", env);
    return true;
  }

  finalizar(value: any, valid: boolean) {
    console.log("entraaaaaaaaaaaaaaaa en finalizar ");

    if (valid) {
      this.spinner.show();

      console.log("this.aceptacionForm.value", this.aceptacionForm.value);

      this.formsService.saveAceptacion(this.aceptacionForm.value).subscribe(
        (response: any) => {
          Swal.fire({
            icon: "info",
            title: "Registro exitoso",
            text:
              "En los próximos dias se le notificará la apruebación de su calificación",
          });
          this.spinner.hide();
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Erro al registrar",
            text: "Se produjo un error al intentar finalizar",
          });
          console.log(error);
          this.spinner.hide();
        }
      );
    } else {
      this.showToasterError(
        "por favor complete todos los campos obligatorios",
        "Campos obligatorios"
      );
    }
  }
}
