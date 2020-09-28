export class AceptacionDto {
  constructor(
    public idperfildocumental?: number,

    public sideclaro?: boolean,
    public siautorizo?: boolean,
    public autorizacion?: string,
    public declaracion?: string
  ) {}
}
