import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-empresarial",
  templateUrl: "./empresarial.component.html",
  styleUrls: ["./empresarial.component.css"],
})
export class EmpresarialComponent implements OnInit {
  /** Formulario de identificacion */
  empresarialForm: FormGroup;

  /** Flag que indica si el formulario 'Identificacion' ya se hizo submit */
  submitted: boolean;

  allQuestions: any = [
    {
      id: 1,
      question: "What is the capital of Belgium?",
      answers: [
        { id: 1, resp: "Ford", peso: 1 },
        { id: 2, resp: "vmw", peso: 2 },
        { id: 3, resp: "toyo", peso: 3 },
      ],
    },
    {
      id: 2,
      question: "What of Belgium?",
      answers: [
        { id: 1, resp: "a", peso: 1 },
        { id: 2, resp: "b", peso: 2 },
        { id: 3, resp: "c", peso: 3 },
      ],
    },
    {
      id: 3,
      question: "elgium?",
      answers: [
        { id: 1, resp: "x", peso: 1 },
        { id: 3, resp: "y", peso: 2 },
        { id: 3, resp: "z", peso: 3 },
      ],
    },
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}
  private initForm() {
    this.empresarialForm = this.fb.group({
      fechaaperturaruc: [null, [Validators.required]],
      actividadeconomicaprincipal: [null, [Validators.required]],
      actividadeconomicasecundaria: [null, [Validators.required]],
    });
  }

  /**
   * Se envía el formulario info-contacto
   *
   * @param value Valor del formulario
   */
  sendForm(value: any, valid: boolean) {
    this.submitted = true;
  }

  HomePage() {}

  onItemChange(value) {
    console.log(" Value is : ", value);
  }

  /**Method call on submit the test */
  submitTest() {
    /*   		this.rightAnswer = 0;
		this.totalAnswered = 0;
		for (let i = 0; i < this.allQuestions.length; i++) {
			if ("selected" in this.allQuestions[i] && (this.allQuestions[i]["selected"] != null)) {
				this.totalAnswered++;
				if (this.allQuestions[i]["selected"] == this.allQuestions[i]["answer"]) {
					this.rightAnswer++;
				}
			}

		}
*/

    for (let i = 0; i < this.allQuestions.length; i++) {
      console.log(this.allQuestions[i]);
    }
  }
}
