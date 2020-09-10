import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import { ComercialDto } from "../../../common/dtos/form/ComercialDto";
import {
  ParamAllQuestions,
  ParamPregunta,
  ParamRespuesta,
  ParamRespuestaSeleccionada,
} from "../../../common/dtos/parameters";
import { LoginService } from "../../../logueo/login/login.service";
import { storageList } from "../../../shared/bd/indexedDB";
import { ProcessIDB } from "../../../shared/bd/process.indexedDB";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "../formulario.service";

@Component({
  selector: "app-comercial",
  templateUrl: "./comercial.component.html",
  styleUrls: ["./comercial.component.css"],
})
export class ComercialComponent implements OnInit {
  lstRespuestasSinSeleccionar: ParamRespuestaSeleccionada[] = [];
  lstRespuestasSeleccionadas: ParamRespuestaSeleccionada[] = [];
  allQuestions: ParamAllQuestions[] = [];
  lstRespuestas: ParamRespuesta[] = [];
  lstPreguntas: ParamPregunta[] = [];

  processIDB: ProcessIDB;

  submitted: boolean;

  idTipoPerfil;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private dbService: NgxIndexedDBService,
    private formsService: FormularioService,
    private notifyService: NotificationService
  ) {
    this.spinner.show();
    this.processIDB = new ProcessIDB(dbService); // creamos una instancia para manejar la base de datos
  }

  ngOnInit() {
    this.loginService.checkExpirationToken();

    this.formsService.getComercial().subscribe(
      async (comercialDto) => {
        console.log("llega allForms empresarialDto", comercialDto);

        this.idTipoPerfil = comercialDto.idtipoperfil;

        await this.loadPreguntasRespuestas();

        if (this.isEmpty(comercialDto.lstRespuestaSeleccionada)) {
          this.seteoRespuestaSinSeleccionar();

          this.seteoEstructuraAllQuestions();
        } else {
          this.seteoIdRespuestaSeleccionada(
            comercialDto.lstRespuestaSeleccionada
          );
          this.seteoEstructuraAllQuestions();

          this.seteoLstRespuestaSeleccionada(
            comercialDto.lstRespuestaSeleccionada
          );
        }

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

  isEmpty = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  seteoEstructuraAllQuestions = () => {
    for (let i = 0; i < this.lstPreguntas.length; i++) {
      const parameterAllQuestions: ParamAllQuestions = new ParamAllQuestions();
      parameterAllQuestions.id = this.lstPreguntas[i].id;
      parameterAllQuestions.question = this.lstPreguntas[i].name;

      const answers: ParamRespuestaSeleccionada[] = this.lstRespuestasSinSeleccionar.filter(
        (respuestaSeleccionada: ParamRespuestaSeleccionada) =>
          respuestaSeleccionada.idpregunta === this.lstPreguntas[i].id
      );
      parameterAllQuestions.answers = answers;

      this.allQuestions.push(parameterAllQuestions);
    }
    // console.log("AllQuestions", this.allQuestions);
  };

  seteoIdRespuestaSeleccionada = (
    lstRespuestaSeleccionada: ParamRespuestaSeleccionada[]
  ) => {
    for (let i = 0; i < this.lstRespuestas.length; i++) {
      const respuestasSinSeleccionar: ParamRespuestaSeleccionada = new ParamRespuestaSeleccionada();

      respuestasSinSeleccionar.idpregunta = this.lstRespuestas[i].idpregunta;
      respuestasSinSeleccionar.idrespuesta = this.lstRespuestas[i].id;
      respuestasSinSeleccionar.name = this.lstRespuestas[i].name;

      const objRespSeleccionada: ParamRespuestaSeleccionada = lstRespuestaSeleccionada.find(
        (respSeleccionada) =>
          respSeleccionada.idpregunta === respuestasSinSeleccionar.idpregunta
      );

      if (objRespSeleccionada) {
        respuestasSinSeleccionar.idrespuestaseleccionada =
          objRespSeleccionada.idrespuestaseleccionada;
      } else {
        i = this.lstRespuestas.length;
      }

      this.lstRespuestasSinSeleccionar.push(respuestasSinSeleccionar);
    }
  };

  seteoLstRespuestaSeleccionada = (
    lstRespuestaSeleccionada: ParamRespuestaSeleccionada[]
  ) => {
    for (let i = 0; i < this.allQuestions.length; i++) {
      for (let j = 0; j < this.allQuestions[i].answers.length; j++) {
        const answer = this.allQuestions[i].answers[j];

        if (
          answer.idpregunta === lstRespuestaSeleccionada[i].idpregunta &&
          answer.idrespuesta === lstRespuestaSeleccionada[i].idrespuesta
        ) {
          this.lstRespuestasSeleccionadas[i] = this.allQuestions[i].answers[j];
        }
      }
    }
  };

  seteoRespuestaSinSeleccionar = () => {
    for (let i = 0; i < this.lstRespuestas.length; i++) {
      const respuestasSinSeleccionar: ParamRespuestaSeleccionada = new ParamRespuestaSeleccionada();

      respuestasSinSeleccionar.idpregunta = this.lstRespuestas[i].idpregunta;
      respuestasSinSeleccionar.idrespuesta = this.lstRespuestas[i].id;
      respuestasSinSeleccionar.name = this.lstRespuestas[i].name;

      this.lstRespuestasSinSeleccionar.push(respuestasSinSeleccionar);
    }
  };

  loadPreguntasRespuestas = async () => {
    const preguntasNoUsada = await this.dbService
      .getAllByIndex(storageList[11], "idtipoperfil", this.idTipoPerfil)
      .then(
        (preguntas) => {
          this.agregaNumeroAlaPregunta(preguntas);
        },
        (error) => {
          console.log("getByIndex", error);
        }
      );

    const repuestasNoUsada = await this.dbService
      .getAllByIndex(storageList[10], "idtipoperfil", this.idTipoPerfil)
      .then(
        (respuestas) => {
          this.lstRespuestas = respuestas;
        },
        (error) => {
          console.log(error);
        }
      );
  };

  agregaNumeroAlaPregunta = (lstPreguntas: ParamPregunta[]) => {
    for (let i = 0; i < lstPreguntas.length; i++) {
      lstPreguntas[i].name = i + 1 + ". " + lstPreguntas[i].name;
    }
    this.lstPreguntas = lstPreguntas;

    console.log("this.lstPreguntas", this.lstPreguntas);
  };

  onItemChange(value: ParamRespuestaSeleccionada, i, j) {
    /* console.log(" Value is : ", value);
    console.log(" fila : ", i);
    console.log(" columna : ", j);*/
    this.lstRespuestasSeleccionadas[i] = value;
  }

  cuestionarioEstaLleno = () => {
    const tamanioAllQuestions: number = this.allQuestions.length;
    let acumulador = 0;
    for (let i = 0; i < tamanioAllQuestions; i++) {
      if (this.lstRespuestasSeleccionadas[i]) {
        acumulador = acumulador + 1;
      }
    }
    return acumulador === tamanioAllQuestions ? true : false;
  };

  retrocederForm() {
    this.router.navigate(["/financiero"]);
  }
  sendForm() {
    this.submitted = true;
    if (this.cuestionarioEstaLleno) {
      console.log(
        "this.respuestasSeleccionadas",
        this.lstRespuestasSeleccionadas
      );
      const comercialDto: ComercialDto = new ComercialDto();
      comercialDto.idtipoperfil = this.idTipoPerfil;
      comercialDto.lstRespuestaSeleccionada = this.lstRespuestasSeleccionadas;

      console.log("empresarialDto enviado", comercialDto);

      this.spinner.show();
      this.formsService.saveComercial(comercialDto).subscribe(
        (comercial: ComercialDto) => {
          console.log("llega comercial ", comercial);
          this.router.navigate(["/documental"]);

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
  }
}
