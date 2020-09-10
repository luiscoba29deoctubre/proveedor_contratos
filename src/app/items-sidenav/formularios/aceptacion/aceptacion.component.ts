import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
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
      url: "http://localhost:3000/proveedor-api/v1/forms/upload-pdf/",
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
  constructor(
    private http: HttpClient,
    private router: Router,
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
      .get("http://localhost:3000/proveedor-api/v1/forms/download-pdf", {
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

        /*this.idTipoPerfil = empresarialDto.idtipoperfil;

        await this.loadPreguntasRespuestas();

        if (this.isEmpty(empresarialDto.lstRespuestaSeleccionada)) {
          this.seteoRespuestaSinSeleccionar();

          this.seteoEstructuraAllQuestions();
        } else {
          this.seteoInputs(empresarialDto);

          this.seteoIdRespuestaSeleccionada(
            empresarialDto.lstRespuestaSeleccionada
          );
          this.seteoEstructuraAllQuestions();

          this.seteoLstRespuestaSeleccionada(
            empresarialDto.lstRespuestaSeleccionada
          );

        }

          */

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

  sendForm() {
    /*
    this.submitted = true;

    if (this.cuestionarioEstaLleno && this.empresarialForm.valid) {
      this.spinner.show();
      // console.log(        "this.respuestasSeleccionadas",        this.lstRespuestasSeleccionadas      );
      // console.log("this.empresarialForm.value", this.empresarialForm.value);
      const {
        fechaaperturaruc,
        actividadeconomicaprincipal,
        actividadeconomicasecundaria,
      } = this.empresarialForm.value;

      const empresarialDto: EmpresarialDto = new EmpresarialDto(
        this.idTipoPerfil,
        fechaaperturaruc,
        actividadeconomicaprincipal,
        actividadeconomicasecundaria
      );

      empresarialDto.lstRespuestaSeleccionada = this.lstRespuestasSeleccionadas;

      console.log("empresarialDto enviado", empresarialDto);

      this.formsService.saveEmpresarial(empresarialDto).subscribe(
        (empresarial: EmpresarialDto) => {
          console.log("llega empresarial ", empresarial);
          this.router.navigate(["/financiero"]);

          this.showToasterSuccess();
          this.spinner.hide();
        },
        (error) => {
          this.showToasterError();
          console.log(error);
          this.spinner.hide();
        }
      );
    }
    */
  }
}
