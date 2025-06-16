import type { WifiBand } from './WifiBand';
import type { WifiVersion } from './WifiVersion';
import type { WifiSpeed } from './WifiSpeed';
import type { WifiConnection } from './WifiConnection';

export interface WifiCard {
  id_k: number;
  nazwa: string;
  status: string;
  id_u: number;
  pasmo: WifiBand; // teraz z pasmo6GHz
  wersja: WifiVersion; // teraz z polem wersja: 'B' | 'G' | ...
  predkosc: WifiSpeed; // teraz z polem predkosc: number
  polaczenia_karty: WifiConnection[];
}