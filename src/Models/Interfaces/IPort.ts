import type { PortConnection } from './IPortConnection';
import type { PortSpeed } from './IPortSpeed';

export type PortType = 'RJ45' | 'SFP';

export interface Port {
  id_p: number;
  nazwa: string;
  status: string;
  id_u: number;
  typ: PortType;
  predkosc_portu: PortSpeed;
  polaczenia_portu: PortConnection[];
}