import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import Swal from "sweetalert2";
import {
  AngularFileUploaderConfig,
  ReplaceTexts,
  UploadInfo,
} from "./angular-file-uploader.types";

@Component({
  selector: "angular-file-uploader",
  templateUrl: "./angular-file-uploader.component.html",
  styleUrls: ["./angular-file-uploader.component.css"],
})
export class AngularFileUploaderComponent implements OnChanges {
  // Inputs
  @Input()
  config: AngularFileUploaderConfig;

  @Input()
  resetUpload = false;

  @Input()
  numberFileUpload;

  @Input()
  allowedFiles: File[]  = [];

  // Outputs
  @Output()
  ApiResponse = new EventEmitter();

  @Output()
  everythingDone: EventEmitter<UploadInfo[]> = new EventEmitter<UploadInfo[]>();

  // Properties
  theme: string;
  id: number;
  hideProgressBar: boolean;
  maxSize: number;
  uploadAPI: string;
  method: string;
  formatsAllowed: string;
  multiple: boolean;
  headers: HttpHeaders | { [header: string]: string | string[] };
  params: HttpParams | { [param: string]: string | string[] };
  responseType: string;
  hideResetBtn: boolean;
  hideSelectBtn: boolean;

  notAllowedFiles: {
    fileName: string;
    fileSize: string;
    errorMsg: string;
  }[] = [];
  Caption: string[] = [];
  isAllowedFileSingle = true;
  progressBarShow = false;
  enableUploadBtn = false;
  uploadMsg = false;
  afterUpload = false;
  uploadStarted = false;
  uploadMsgText: string;
  uploadMsgClass: string;
  uploadPercent: number;
  replaceTexts: ReplaceTexts;
  currentUploads: any[] = [];
  fileNameIndex = true;

  private idDate: number = +new Date();

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    // Track changes in Configuration and see if user has even provided Configuration.
    if (changes.config && this.config) {
      // Assign User Configurations to Library Properties.
      this.theme = this.config.theme || "";
      this.id =
        this.config.id ||
        parseInt((this.idDate / 10000).toString().split(".")[1], 10) +
          Math.floor(Math.random() * 20) * 10000;
      this.hideProgressBar = this.config.hideProgressBar || false;
      this.hideResetBtn = this.config.hideResetBtn || false;
      this.hideSelectBtn = this.config.hideSelectBtn || false;
      this.maxSize = (this.config.maxSize || 20) * 1024000; // mb to bytes.
      this.uploadAPI = this.config.uploadAPI.url;
      this.method = this.config.uploadAPI.method || "POST";
      this.formatsAllowed =
        this.config.formatsAllowed || ".jpg,.png,.pdf,.docx,.txt,.gif,.jpeg";
      this.multiple = this.config.multiple || false;
      this.headers = this.config.uploadAPI.headers || {};
      this.params = this.config.uploadAPI.params || {};
      this.responseType = this.config.uploadAPI.responseType || null;
      this.fileNameIndex = this.config.fileNameIndex === false ? false : true;
      this.replaceTexts = {
        selectFileBtn: this.multiple ? "Select Files" : "Select File",
        resetBtn: "Reset",
        uploadBtn: "Upload",
        dragNDropBox: "Drag N Drop",
        attachPinBtn: this.multiple ? "Attach Files..." : "Attach File...",
        afterUploadMsg_success: "Successfully Uploaded !",
        afterUploadMsg_error: "Upload Failed !",
        sizeLimit: "Size Limit",
      }; // default replaceText.
      if (this.config.replaceTexts) {
        // updated replaceText if user has provided any.
        this.replaceTexts = {
          ...this.replaceTexts,
          ...this.config.replaceTexts,
        };
      }
    }

    // Reset when resetUpload value changes from false to true.
    if (changes.resetUpload) {
      if (changes.resetUpload.currentValue === true) {
        this.resetFileUpload();
      }
    }
  }

  // Reset following properties.
  resetFileUpload() {
    this.allowedFiles = [];
    this.Caption = [];
    this.notAllowedFiles = [];
    this.uploadMsg = false;
    this.enableUploadBtn = false;
  }

  // When user selects files.
  onChange(event: any) {
    this.notAllowedFiles = [];
    const fileExtRegExp: RegExp = /(?:\.([^.]+))?$/;
    let fileList: FileList;

    if (this.afterUpload || !this.multiple) {
      this.allowedFiles = [];
      this.Caption = [];
      this.afterUpload = false;
    }

    if (event.type === "drop") {
      fileList = event.dataTransfer.files;
    } else {
      fileList = event.target.files || event.srcElement.files;
    }

    // 'forEach' does not exist on 'filelist' that's why this good old 'for' is used.
    for (let i = 0; i < fileList.length; i++) {
      const currentFileExt = fileExtRegExp
        .exec(fileList[i].name)[1]
        .toLowerCase(); // Get file extension.
      const isFormatValid = this.formatsAllowed.includes(currentFileExt);

      const isSizeValid = fileList[i].size <= this.maxSize;

      // Check whether current file format and size is correct as specified in the configurations.
      if (isFormatValid && isSizeValid) {
        this.allowedFiles.push(fileList[i]);
      } else {
        this.notAllowedFiles.push({
          fileName: fileList[i].name,
          fileSize: this.convertSize(fileList[i].size),
          errorMsg: !isFormatValid ? "Invalid format" : "Invalid size",
        });
      }
    }

    // If there's any allowedFiles.
    if (this.allowedFiles.length >= this.numberFileUpload) {
      this.enableUploadBtn = true;
    } else {
      this.enableUploadBtn = false;
    }

    this.uploadMsg = false;
    this.uploadStarted = false;
    this.uploadPercent = 0;
    event.target.value = null;
  }

  meetNumberOfFiles() {
    // console.log("this.allowedFiles.length ", this.allowedFiles.length);
    // console.log("this.numberFileUpload", this.numberFileUpload);

    // If there's any allowedFiles.
    if (this.allowedFiles.length >= this.numberFileUpload) {
      if (this.allowedFiles.length >= 10) {
        Swal.fire({
          icon: "error",
          title: "Limite de archivos",
          text: `Subir maximo 10 archivos`,
        });
        this.enableUploadBtn = false;
        return false;
      }

      this.enableUploadBtn = true;

      return true;
    } else {
      this.enableUploadBtn = false;

      Swal.fire({
        icon: "error",
        title: "Faltan archivos",
        text: `Subir ${this.numberFileUpload} o mas archivos`,
      });
      return false;
    }
  }

  uploadFiles() {
    // controla el numero de archivos que debe subir
    if (!this.meetNumberOfFiles()) {
      return;
    }

    this.progressBarShow = true;
    this.uploadStarted = true;
    this.notAllowedFiles = [];
    let isError = false;
    this.isAllowedFileSingle = this.allowedFiles.length <= 1;
    const formData = new FormData();

    console.log("this.allowedFiles", this.allowedFiles);

    // Add data to be sent in this request
    for (let i = 0; i < this.allowedFiles.length; i++) {
      formData.append(
        "multi-files",
        this.allowedFiles[i]
        //    this.allowedFiles[i].name
      );
      console.log(" this.allowedFiles[i].name", this.allowedFiles[i].name);
    }

    const options = {
      headers: this.headers,
      params: this.params,
    };

    if (this.responseType) (options as any).responseType = this.responseType;

    this.http
      .request(this.method.toUpperCase(), this.uploadAPI, {
        body: formData,
        reportProgress: true,
        observe: "events",
        ...options,
      })
      .subscribe(
        (event) => {
          // Upload Progress
          if (event.type === HttpEventType.UploadProgress) {
            this.enableUploadBtn = false; // button should be disabled if process uploading
            const currentDone = event.loaded / event.total;
            this.uploadPercent = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            if (event.status === 200 || event.status === 201) {
              // Success
              this.progressBarShow = false;
              this.enableUploadBtn = false;
              this.uploadMsg = true;
              this.afterUpload = true;
              if (!isError) {
                this.uploadMsgText = this.replaceTexts.afterUploadMsg_success;
                this.uploadMsgClass = "text-success lead";
              }
            } else {
              // Failure
              isError = true;
              this.handleErrors();
            }

            this.ApiResponse.emit(event);
          } else {
            //console.log('Event Other: ', event);
          }
        },
        (error) => {
          // Failure
          isError = true;
          this.handleErrors();
          this.ApiResponse.emit(error);
        }
      );
  }

  handleErrors() {
    this.progressBarShow = false;
    this.enableUploadBtn = false;
    this.uploadMsg = true;
    this.afterUpload = true;
    this.uploadMsgText = this.replaceTexts.afterUploadMsg_error;
    this.uploadMsgClass = "text-danger lead";
  }

  removeFile(i: any, sf_na: any) {
    if (sf_na === "sf") {
      this.allowedFiles.splice(i, 1);
      this.Caption.splice(i, 1);
    } else {
      this.notAllowedFiles.splice(i, 1);
    }

    if (this.allowedFiles.length === 0) {
      this.enableUploadBtn = false;
    }
  }

  convertSize(fileSize: number): string {
    return fileSize < 1024000
      ? (fileSize / 1024).toFixed(2) + " KB"
      : (fileSize / 1024000).toFixed(2) + " MB";
  }

  attachpinOnclick() {
    const element = document.getElementById("sel" + this.id);
    if (element !== null) {
      element.click();
    }
  }

  drop(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.onChange(event);
  }

  allowDrop(event: any) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }
}
