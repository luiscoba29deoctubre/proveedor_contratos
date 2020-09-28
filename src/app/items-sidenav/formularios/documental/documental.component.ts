import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import { DocumentalDto } from "../../../common/dtos/form/DocumentalDto";
import { ParamDocumento } from "../../../common/dtos/parameters";
import { LoginService } from "../../../logueo/login/login.service";
import { storageList } from "../../../shared/bd/indexedDB";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "../formulario.service";
import { ApiEndpoints } from "../../../logueo/api.endpoints";

@Component({
  selector: "app-documental",
  templateUrl: "./documental.component.html",
  styleUrls: ["./documental.component.css"],
})
export class DocumentalComponent implements OnInit {
  resetUpload: boolean;

  lstDocumentos: ParamDocumento[] = [];

  valido: boolean;

  constructor(
    private router: Router,
    private endpoints: ApiEndpoints,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private dbService: NgxIndexedDBService,
    private formsService: FormularioService,
    private notifyService: NotificationService
  ) {
    this.valido = false;
  }

  ngOnInit() {
    this.spinner.show();
    this.loginService.checkExpirationToken();

    this.formsService.getDocumental().subscribe(
      async (response) => {
        const documentalDto: DocumentalDto = response.body;

        console.log("llega documentalDto", documentalDto);

        await this.loadDocuments();

        if (this.isEmpty(documentalDto.lstDocumento)) {
          console.log("esta adentro");
        } else {
          this.seteoDocumentos(documentalDto);
        }

        console.log(" this.lstDocumentos", this.lstDocumentos);

        this.spinner.hide();
      },
      (error) => {
        console.log("aqui error hay ", error);
        this.spinner.hide();
      }
    );
  }

  showToasterSuccess(subtitulo, titulo) {
    this.notifyService.showSuccess(subtitulo, titulo);
  }

  showToasterError(subtitulo, titulo) {
    this.notifyService.showError(subtitulo, titulo);
  }

  isEmpty = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  loadDocuments = async () => {
    const preguntasNoUsada = await this.dbService.getAll(storageList[12]).then(
      (preguntas) => {
        this.agregaLetraAlaPregunta(preguntas);
      },
      (error) => {
        console.log("getByIndex", error);
      }
    );
  };

  agregaLetraAlaPregunta = (lstDocumentos: ParamDocumento[]) => {
    let j = 65;

    for (let i = 0; i < lstDocumentos.length; i++) {
      lstDocumentos[i].name =
        String.fromCharCode(j) + ". " + lstDocumentos[i].name;
      lstDocumentos[i].lstDocumentoPerfilDocumental = [];
      j++;
    }
    this.lstDocumentos = lstDocumentos;
  };

  seteoDocumentos = (documentalDto: DocumentalDto) => {
    for (let i = 0; i < this.lstDocumentos.length; i++) {
      if (this.lstDocumentos[i].id === documentalDto.lstDocumento[i].id) {
        this.lstDocumentos[i].lstDocumentoPerfilDocumental =
          documentalDto.lstDocumento[i].lstDocumentoPerfilDocumental;
      }
    }
  };

  setIdAfuConfig = (idDocumento: number) => {
    return {
      multiple: true,
      formatsAllowed: ".pdf",
      maxSize: "2", // MB
      uploadAPI: {
        url: this.endpoints.url_api_upload_pdf,
        method: "POST",
        headers: {
          auth: `Bearer ${sessionStorage.getItem("token")}`,
        },
        params: {
          idDocumento: idDocumento,
        },
        responseType: "blob",
      },

      hideProgressBar: false,
      hideResetBtn: false,
      hideSelectBtn: false,
      fileNameIndex: true,
      replaceTexts: {
        selectFileBtn: "Seleccionar archivos",
        resetBtn: "Quitar archivos",
        uploadBtn: "Subir archivos",
        afterUploadMsg_success: "Carga exitosa !",
        afterUploadMsg_error: "Error al intentar subir archivos !",
        sizeLimit: "Tamaño máximo",
      },
    };
  };

  docUpload(env) {
    console.log(env);
    console.log("entraaaaaaa", env);
    return true;
  }

  sendForm() {
    console.log("entra en sendForm");

    if (this.valido) {
      this.spinner.show();
      this.router.navigate(["/aceptacion"]);
      this.spinner.hide();
    } else {
      this.showToasterError(
        "por favor complete todos los campos obligatorios",
        "Campos obligatorios"
      );
    }
  }
}
