export class AceptacionDto {
  constructor(
    public idaceptacion?: number,

    public declaracion?: string,
    public autorizacion?: string,
    public siautorizo?: boolean,
    public sideclaro?: boolean,
    public numero?: number
  ) {}
}
