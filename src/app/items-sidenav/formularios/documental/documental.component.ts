import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import {
  ParamDocumento,
  ParamDocumentoPerfilDocumental,
} from "../../../common/dtos/parameters";
import { LoginService } from "../../../logueo/login/login.service";
import { storageList } from "../../../shared/bd/indexedDB";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "../formulario.service";

@Component({
  selector: "app-documental",
  templateUrl: "./documental.component.html",
  styleUrls: ["./documental.component.css"],
})
export class DocumentalComponent implements OnInit {
  resetUpload: boolean;

  lstDocumentos: ParamDocumento[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private dbService: NgxIndexedDBService,
    private localeService: BsLocaleService,
    private formsService: FormularioService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.loginService.checkExpirationToken();

    this.formsService.getDocumental().subscribe(
      async (documentalDto) => {
        console.log("llega documentalDto", documentalDto);

        await this.loadDocuments();

        if (this.isEmpty(documentalDto.lstDocumento)) {
        } else {
  //        this.seteoDocumentos(documentalDto.lstDocumento);
        }

        this.spinner.hide();
      },
      (error) => {
        console.log("aqui error hay ", error);
        this.spinner.hide();
      }
    );
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

      j++;
    }
    this.lstDocumentos = lstDocumentos;
  };

  seteoDocumentos = (
    lstDocumentoPerfilDocumental: ParamDocumentoPerfilDocumental[]
  ) => {
    for (let i = 0; i < this.lstDocumentos.length; i++) {
      this.lstDocumentos[
        i
      ].lstDocumentoPerfilDocumental = lstDocumentoPerfilDocumental;
    }
  };

  setIdAfuConfig = (idDocumento: number) => {
    return {
      multiple: true,
      formatsAllowed: ".pdf",
      maxSize: "2", // MB
      uploadAPI: {
        url: "http://localhost:3000/proveedor-api/v1/forms/upload-pdf/",
        method: "POST",
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
        dragNDropBox: "Drag N Drop",
        attachPinBtn: "Attach Files...",
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
}
