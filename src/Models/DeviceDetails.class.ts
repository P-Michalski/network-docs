import { Device } from './Device.class';

export class DeviceDetails {
  urzadzenie: Device;
  typ: any;
  lokalizacja: any;
  mac: any;
  porty: any[];
  karty_wifi: any[];

  constructor(
    urzadzenie: Device,
    typ: any,
    lokalizacja: any,
    mac: any,
    porty: any[],
    karty_wifi: any[]
  ) {
    this.urzadzenie = urzadzenie;
    this.typ = typ;
    this.lokalizacja = lokalizacja;
    this.mac = mac;
    this.porty = porty;
    this.karty_wifi = karty_wifi;
  }

  static fromApi(data: any): DeviceDetails {
    return new DeviceDetails(
      Device.fromApi(data.urzadzenie),
      data.typ,
      data.lokalizacja,
      data.mac,
      data.porty,
      data.karty_wifi
    );
  }
}
