import type { Device } from './Device';
import type { DeviceType } from './DeviceType';
import type { Port } from './Port';
import type { WifiCard } from './WifiCard';
import type { MacAddress } from './MacAddress';
import type { Location } from './Location';

export interface DeviceDetails {
  urzadzenie: Device;
  typ: DeviceType;
  porty: Port[];
  karty_wifi: WifiCard[];
  mac: MacAddress;
  lokalizacja: Location;
}