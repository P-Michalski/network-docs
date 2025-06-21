import { Device } from './Device.class';
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
      Device.fromApi(data.urzadzenie),
      data.typ,
      data.lokalizacja,
      data.mac,
      data.porty,
      data.karty_wifi
    );
  }

  // Metoda pomocnicza do sprawdzenia czy obiekt to instancja klasy
  isInstance(): boolean {
    return this instanceof DeviceDetails;
  }

  // Metoda do pobrania liczby wszystkich połączeń urządzenia
  getTotalConnections(): number {
    const portConnections =
      this.porty?.reduce(
        (sum, port) => sum + (port.polaczenia_portu?.length || 0),
        0
      ) || 0;
    const wifiConnections =
      this.karty_wifi?.reduce(
        (sum, card) => sum + (card.polaczenia_karty?.length || 0),
        0
      ) || 0;
    return portConnections + wifiConnections;
  }

  // Metoda do sprawdzenia czy urządzenie ma aktywne połączenia
  hasActiveConnections(): boolean {
    return this.getTotalConnections() > 0;
  }
}
