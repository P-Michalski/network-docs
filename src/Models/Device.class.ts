export class Device {
  public id_u: number | undefined;
  public nazwa_urzadzenia: string;
  public ilosc_portow: number;

  constructor(
    id_u: number | undefined,
    nazwa_urzadzenia: string,
    ilosc_portow: number
  ) {
    this.id_u = id_u;
    this.nazwa_urzadzenia = nazwa_urzadzenia;
    this.ilosc_portow = ilosc_portow;
  }

  opis(): string {
    return `${this.nazwa_urzadzenia} (porty: ${this.ilosc_portow})`;
  }

  static fromApi(data: any): Device {
    return new Device(data.id_u, data.nazwa_urzadzenia, data.ilosc_portow);
  }
}
