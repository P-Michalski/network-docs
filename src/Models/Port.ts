import type { PortConnection } from './PortConnection';

export interface Port {
  id_p: number;
  nazwa: string;
  status: string;
  id_u: number;
  polaczenia_portu: PortConnection[];
}