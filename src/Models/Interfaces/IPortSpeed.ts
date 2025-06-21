// Model odpowiadający tabeli predkosc_p
export type PortSpeedEnum = '10Mb/s' | '100Mb/s' | '1Gb/s' | '2,5Gb/s' | '5Gb/s' | '10Gb/s' | '25Gb/s';

export interface PortSpeed {
  id_p: number;
  predkosc: PortSpeedEnum;
}
