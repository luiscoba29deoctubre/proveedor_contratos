import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import { OperativoDto } from "../../../common/dtos/form/OperativoDto";
import {
  ParamAllQuestions,
  ParamPregunta,
  ParamRespuesta,
  ParamRespuestaSeleccionada
} from "../../../common/dtos/parameters";
import { LoginService } from "../../../logueo/login/login.service";
import { storageList } from "../../../shared/bd/indexedDB";
import { ProcessIDB } from "../../../shared/bd/process.indexedDB";
import { NotificationService } from "../../../shared/services/notification.service";
import { FormularioService } from "../formulario.service";

@Component({
  selector: "app-operativo",
  templateUrl: "./operativo.component.html",
  styleUrls: ["./operativo.component.css"],
})
export class OperativoComponent implements OnInit {
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

    this.formsService.getOperativo().subscribe(
      async (operativoDto) => {
        console.log("llega allForms empresarialDto", operativoDto);

        this.idTipoPerfil = operativoDto.idtipoperfil;

        await this.loadPreguntasRespuestas();

        if (this.isEmpty(operativoDto.lstRespuestaSeleccionada)) {
          this.seteoRespuestaSinSeleccionar();

          this.seteoEstructuraAllQuestions();
        } else {
          this.seteoIdRespuestaSeleccionada(
            operativoDto.lstRespuestaSeleccionada
          );
          this.seteoEstructuraAllQuestions();

          this.seteoLstRespuestaSeleccionada(
            operativoDto.lstRespuestaSeleccionada
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

  retrocederForm() {
    this.router.navigate(["/financiero"]);
  }

  sendForm(valid: boolean) {
    this.submitted = true;

    if (valid) {
      const operativoDto: OperativoDto = new OperativoDto();
      operativoDto.idtipoperfil = this.idTipoPerfil;
      operativoDto.lstRespuestaSeleccionada = this.lstRespuestasSeleccionadas;

      console.log("empresarialDto enviado", operativoDto);

      this.spinner.show();
      this.formsService.saveOperativo(operativoDto).subscribe(
        (operativo: OperativoDto) => {
          console.log("llega empresarial ", operativo);
          this.router.navigate(["/comercial"]);

          this.showToasterSuccess();
          this.spinner.hide();
        },
        (error) => {
          this.showToasterError("Error al guardar perfil operativo", "Error");
   
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
