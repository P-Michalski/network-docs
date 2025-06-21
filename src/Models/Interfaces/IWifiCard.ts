import type { WifiBand } from './IWifiBand';
import type { WifiVersion } from './IWifiVersion';
import type { WifiSpeed } from './IWifiSpeed';
import type { WifiConnection } from './IWifiConnection';

export interface WifiCard {
  id_k: number;
  nazwa: string;
  status: string;
  id_u: number;
  pasmo: WifiBand;
  wersja: WifiVersion;
  predkosc: WifiSpeed;
  polaczenia_karty: WifiConnection[];
}