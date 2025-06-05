import type { WifiBand } from './WifiBand';
import type { WifiVersion } from './WifiVersion';
import type { WifiSpeed } from './WifiSpeed';
import type { WifiConnection } from './WifiConnection';

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