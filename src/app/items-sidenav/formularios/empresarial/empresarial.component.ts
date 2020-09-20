import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { format } from "date-fns";
import { defineLocale, esLocale } from "ngx-bootstrap/chronos";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { NgxSpinnerService } from "ngx-spinner";
import { EmpresarialDto } from "../../../common/dtos/form/EmpresarialDto";
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
  selector: "app-empresarial",
  templateUrl: "./empresarial.component.html",
  styleUrls: ["./empresarial.component.css"],
})
export class EmpresarialComponent implements OnInit {
  lstRespuestasSinSeleccionar: ParamRespuestaSeleccionada[] = [];
  lstRespuestasSeleccionadas: ParamRespuestaSeleccionada[] = [];
  allQuestions: ParamAllQuestions[] = [];
  lstRespuestas: ParamRespuesta[] = [];
  lstPreguntas: ParamPregunta[] = [];

  empresarialForm: FormGroup;

  processIDB: ProcessIDB;

  fechaaperturaruc;
  actividadeconomicaprincipal;
  actividadeconomicasecundaria;

  submitted: boolean;

  idTipoPerfil;

  locale = "es";

  constructor(
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
    this.initForm();
    this.processIDB = new ProcessIDB(dbService); // creamos una instancia para manejar la base de datos
    // con estas 2 líneas se coloca el calendario en español,
    // la solucion viene de fwirsch commented on 23 Feb 2019, https://github.com/valor-software/ngx-bootstrap/issues/4752
    defineLocale("es", esLocale);
    this.localeService.use("es");
  }

  async ngOnInit(): Promise<void> {
    this.loginService.checkExpirationToken();

    this.formsService.getEmpresarial().subscribe(
      async (empresarialDto) => {
        console.log("llega allForms empresarialDto", empresarialDto);

        this.idTipoPerfil = empresarialDto.idtipoperfil;

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

        this.spinner.hide();
      },
      (error) => {
        console.log("aqui error hay ", error);
        this.spinner.hide();
      }
    );
  }

  seteoInputs = (e: EmpresarialDto) => {
    this.empresarialForm.controls["actividadeconomicaprincipal"].setValue(
      e.actividadeconomicaprincipal
    );
    this.empresarialForm.controls["actividadeconomicasecundaria"].setValue(
      e.actividadeconomicasecundaria
    );

    const parts = e.fechaaperturaruc.split("-");
    const anio = +parts[0];
    const mes = +parts[1];
    const dia = +parts[2];

    const fechaParseada = format(new Date(anio, mes - 1, dia), "dd/MM/yyyy");

    this.empresarialForm.controls["fechaaperturaruc"].setValue(fechaParseada);
  };

  isEmpty = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  private initForm() {
    this.empresarialForm = this.fb.group({
      fechaaperturaruc: [null, [Validators.required]],
      actividadeconomicaprincipal: [null, [Validators.required]],
      actividadeconomicasecundaria: [null, [Validators.required]],
    });
  }

  showToasterSuccess() {
    this.notifyService.showSuccess("guardada exitosamente", "Identificación");
  }

  showToasterError() {
    this.notifyService.showError("Error al guardar identificación", "Error");
  }

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

  onItemChange(value: ParamRespuestaSeleccionada, i, j) {
    /* console.log(" Value is : ", value);
    console.log(" fila : ", i);
    console.log(" columna : ", j);*/
    this.lstRespuestasSeleccionadas[i] = value;
  }

  retrocederForm() {
    this.router.navigate(["/infocontacto"]);
  }

  sendForm() {
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
  }
}
