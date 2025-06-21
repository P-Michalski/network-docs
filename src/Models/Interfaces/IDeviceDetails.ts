import type { Device } from './IDevice';
import type { DeviceType } from './IDeviceType';
import type { Port } from './IPort';
import type { WifiCard } from './IWifiCard';
import type { MacAddress } from './IMacAddress';
import type { Location } from './ILocation';

export interface DeviceDetails {
  urzadzenie: Device;
  typ: DeviceType;
  porty: Port[];
  karty_wifi: WifiCard[];
  mac: MacAddress;
  lokalizacja: Location;
}