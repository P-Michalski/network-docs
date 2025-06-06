import { z } from 'zod';

export const deviceDetailsSchema = z.object({
  urzadzenie: z.object({
    nazwa_urzadzenia: z.string().min(1, 'Podaj nazwę urządzenia'),
    ilosc_portow: z.coerce.number().int().min(1, 'Musi mieć przynajmniej 1 port'),
  }),
  typ: z.object({
    typ_u: z.string().min(1, 'Podaj typ urządzenia'),
  }),
  lokalizacja: z.object({
    miejsce: z.string().min(1, 'Podaj miejsce'),
    szafa: z.string().min(1, 'Podaj szafę'),
    rack: z.string().min(1, 'Podaj rack'),
  }),
  mac: z.object({
    MAC: z.string().min(1, 'Podaj adres MAC'),
  }),
  porty: z.array(z.object({
    nazwa: z.string().min(1, 'Podaj nazwę portu'),
    status: z.string().min(1, 'Podaj status'),
    polaczenia_portu: z.array(z.object({
      id_p: z.number().optional(),
      id_u: z.number().optional(),
      nazwa: z.string().min(1, 'Podaj nazwę połączenia portu'),
      status: z.string().min(1, 'Podaj status połączenia portu'),
    })),
  })),
  karty_wifi: z.array(z.object({
    nazwa: z.string().min(1, 'Podaj nazwę karty'),
    status: z.string().min(1, 'Podaj status'),
    pasmo: z.object({
      pasmo24GHz: z.coerce.number(),
      pasmo5GHz: z.coerce.number(),
    }),
    wersja: z.object({
      WIFI4: z.coerce.number(),
      WIFI5: z.coerce.number(),
      WIFI6: z.coerce.number(),
    }),
    predkosc: z.object({
      '200Mb': z.coerce.number(),
      '800Mb': z.coerce.number(),
      '2Gb': z.coerce.number(),
    }),
  })),
});

export type DeviceDetailsForm = z.infer<typeof deviceDetailsSchema>;

export const defaultFormValues: DeviceDetailsForm = {
  porty: [{ nazwa: '', status: '', polaczenia_portu: [] }],
  karty_wifi: [{
    nazwa: '', status: '',
    pasmo: { pasmo24GHz: 0, pasmo5GHz: 0 },
    wersja: { WIFI4: 0, WIFI5: 0, WIFI6: 0 },
    predkosc: { '200Mb': 0, '800Mb': 0, '2Gb': 0 },
  }],
  urzadzenie: { nazwa_urzadzenia: '', ilosc_portow: 1 },
  typ: { typ_u: '' },
  lokalizacja: { miejsce: '', szafa: '', rack: '' },
  mac: { MAC: '' },
};