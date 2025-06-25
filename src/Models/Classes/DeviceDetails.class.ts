import type { Device } from '../Interfaces/IDevice';
import type { DeviceType } from '../Interfaces/IDeviceType';
import type { Location } from '../Interfaces/ILocation';
import type { MacAddress } from '../Interfaces/IMacAddress';
import type { Port } from '../Interfaces/IPort';
import type { WifiCard } from '../Interfaces/IWifiCard';

export class DeviceDetails {
  urzadzenie: Device;
  typ: DeviceType;
  lokalizacja: Location;
  mac: MacAddress;
  porty: Port[];
  karty_wifi: WifiCard[];
  constructor(
    urzadzenie: Device,
    typ: DeviceType,
    lokalizacja: Location,
    mac: MacAddress,
    porty: Port[],
    karty_wifi: WifiCard[]
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
      data.urzadzenie,
      data.typ,
      data.lokalizacja,
      data.mac,
      data.porty,
      data.karty_wifi
    );
  }
}
