import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
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

  afuConfig = {
    multiple: true,
    formatsAllowed: ".pdf",
    maxSize: "2", // MB
    uploadAPI: {
      url: this.endpoints.url_api_upload_pdf_firmado,
      method: "POST",
      params: {
        page: "1",
      },
      responseType: "blob",
    },

    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: "Seleccionar archivos",
      resetBtn: "Reset",
      uploadBtn: "Subir archivos",
      dragNDropBox: "Drag N Drop",
      attachPinBtn: "Attach Files...",
      afterUploadMsg_success: "Carga exitosa !",
      afterUploadMsg_error: "Error al intentar subir archivos !",
      sizeLimit: "Tamaño máximo",
    },
  };

  declaracion = "";
  autorizacion = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private endpoints: ApiEndpoints,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private dbService: NgxIndexedDBService,
    private localeService: BsLocaleService,
    private formsService: FormularioService,
    private notifyService: NotificationService
  ) {
    this.spinner.show();
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
    this.loginService.checkExpirationToken();

    this.formsService.getAceptacion().subscribe(
      async (aceptacionDto) => {
        console.log("llega aceptacionDto", aceptacionDto);

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

  showToasterSuccess() {
    this.notifyService.showSuccess("guardada exitosamente", "Identificación");
  }

  showToasterError() {
    this.notifyService.showError("Error al guardar identificación", "Error");
  }

  docUpload(env) {
    console.log(env);
    console.log("entraaaaaaa", env);
    return true;
  }

  finalizar() {



    
    Swal.fire({
      icon: "info",
      title: "Registro exitoso",
      text:
        "En los próximos dias se le notificará si se aprueba su calificación",
    });
  }
}
