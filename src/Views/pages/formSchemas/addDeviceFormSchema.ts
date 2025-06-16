import { z } from 'zod';

// Typ dla serializowalnych danych urządzenia
interface SerializableDevice {
  urzadzenie: any;
  porty?: any[];
  karty_wifi?: any[];
  [key: string]: any;
}

// Funkcja do tworzenia schematu z walidacją unikalności MAC
export const createDeviceDetailsSchema = (
  existingDevices: SerializableDevice[], 
  editingDeviceId?: number
)=> z.object({
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
    MAC: z.string().min(1, 'Podaj adres MAC').refine(
      (mac) => {
        // Podczas edycji, pozwól na zachowanie tego samego MAC
        if (editingDeviceId) {
          const currentDevice = existingDevices.find(d => d.urzadzenie.id_u === editingDeviceId);
          if (currentDevice && currentDevice.mac.MAC === mac) {
            return true; // Pozwól na zachowanie obecnego MAC podczas edycji
          }
        }
        // Sprawdź czy MAC nie jest już używany przez inne urządzenie
        return !existingDevices.some(device => device.mac.MAC === mac);
      },
      { message: 'Ten adres MAC jest już używany przez inne urządzenie' }
    ),
  }),  porty: z.array(z.object({
    nazwa: z.string().min(1, 'Podaj nazwę portu'),
    status: z.string().min(1, 'Podaj status'),
    typ: z.enum(['RJ45', 'SFP'], { errorMap: () => ({ message: 'Wybierz typ portu' }) }),
    predkosc_portu: z.object({
      predkosc: z.enum(['10Mb/s', '100Mb/s', '1Gb/s', '2,5Gb/s', '5Gb/s', '10Gb/s', '25Gb/s'], 
        { errorMap: () => ({ message: 'Wybierz prędkość portu' }) }),
    }),
    polaczenia_portu: z.array(z.object({
      id_p: z.number().optional(),
      id_u: z.number().optional(),
      nazwa: z.string().min(1, 'Podaj nazwę połączenia portu'),
      status: z.string().min(1, 'Podaj status połączenia portu'),
    })),  })),karty_wifi: z.array(z.object({
    nazwa: z.string().min(1, 'Podaj nazwę karty'),
    status: z.string().min(1, 'Podaj status'),
    pasmo: z.object({
      pasmo24GHz: z.coerce.number(),
      pasmo5GHz: z.coerce.number(),
      pasmo6GHz: z.coerce.number(),    }).refine(
      (data) => data.pasmo24GHz === 1 || data.pasmo5GHz === 1 || data.pasmo6GHz === 1,
      { message: 'Wybierz przynajmniej jedno pasmo' }
    ),
    wersja: z.object({
      wersja: z.enum(['B', 'G', 'N', 'AC', 'AX', 'BE'], 
        { errorMap: () => ({ message: 'Wybierz wersję WiFi' }) }),
    }),
    predkosc: z.object({
      predkosc: z.coerce.number().min(1, 'Podaj prędkość w Mb/s'),
    }),
  })),
});

// Podstawowy schemat bez walidacji unikalności MAC (fallback)
export const deviceDetailsSchema = createDeviceDetailsSchema([], undefined);

export type DeviceDetailsForm = z.infer<typeof deviceDetailsSchema>;

export const defaultFormValues: DeviceDetailsForm = {
  porty: [{ 
    nazwa: '', 
    status: '', 
    typ: '' as any, // Brak domyślnej wartości
    predkosc_portu: { predkosc: '' as any }, // Brak domyślnej wartości
    polaczenia_portu: [] 
  }],
  karty_wifi: [{
    nazwa: '', 
    status: '',
    pasmo: { pasmo24GHz: 0, pasmo5GHz: 0, pasmo6GHz: 0 },
    wersja: { wersja: '' as any }, // Brak domyślnej wartości
    predkosc: { predkosc: 0 },
  }],
  urzadzenie: { nazwa_urzadzenia: '', ilosc_portow: 1 },
  typ: { typ_u: '' },
  lokalizacja: { miejsce: '', szafa: '', rack: '' },
  mac: { MAC: '' },
};