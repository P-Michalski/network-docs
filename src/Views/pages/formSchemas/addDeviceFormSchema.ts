import { z } from 'zod';

// Typ dla serializowalnych danych urządzenia
interface SerializableDevice {
  urzadzenie: any;
  porty?: any[];
  karty_wifi?: any[];
  [key: string]: any;
}

// Mapowanie wersji WiFi do obsługiwanych pasm
const WIFI_BAND_COMPATIBILITY = {
  'B': { pasmo24GHz: true, pasmo5GHz: false, pasmo6GHz: false },
  'G': { pasmo24GHz: true, pasmo5GHz: false, pasmo6GHz: false },
  'N': { pasmo24GHz: true, pasmo5GHz: true, pasmo6GHz: false },
  'AC': { pasmo24GHz: false, pasmo5GHz: true, pasmo6GHz: false },
  'AX': { pasmo24GHz: true, pasmo5GHz: true, pasmo6GHz: true },
  'BE': { pasmo24GHz: true, pasmo5GHz: true, pasmo6GHz: true },
} as const;

// Maksymalne prędkości dla wersji WiFi
const WIFI_MAX_SPEEDS = {
  'B': 11,
  'G': 54,
  'N': 600,
  'AC': 6933,
  'AX': 9608,
  'BE': 46000,
} as const;

// Minimum portów według typu urządzenia
const MIN_PORTS_BY_TYPE = {
  'Router': 1,
  'Switch': 2,
  'Access Point': 1,
  'PC': 1,
} as const;

// Funkcja do tworzenia schematu z walidacją unikalności MAC
export const createDeviceDetailsSchema = (
  existingDevices: SerializableDevice[], 
  editingDeviceId?: number
)=> {
  return z.object({
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
    }),
    porty: z.array(z.object({
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
      })),
    })),
    // Karty WiFi - walidacja jest warunkowa w zależności od typu urządzenia
    karty_wifi: z.array(z.object({
      nazwa: z.string().min(1, 'Podaj nazwę karty'),
      status: z.string().min(1, 'Podaj status'),
      wersja: z.object({
        wersja: z.enum(['B', 'G', 'N', 'AC', 'AX', 'BE'], 
          { errorMap: () => ({ message: 'Wybierz wersję WiFi' }) }),
      }),
      predkosc: z.object({
        predkosc: z.coerce.number().min(1, 'Podaj prędkość w Mb/s'),
      }),
      pasmo: z.object({
        pasmo24GHz: z.coerce.number(),
        pasmo5GHz: z.coerce.number(),
        pasmo6GHz: z.coerce.number(),
      }),
    }).refine(
      (data) => {
        // Sprawdź kompatybilność wersji WiFi z wybranymi pasmami
        const version = data.wersja.wersja as keyof typeof WIFI_BAND_COMPATIBILITY;
        const compatibility = WIFI_BAND_COMPATIBILITY[version];
        
        // Sprawdź czy wybrane pasma są obsługiwane przez wersję WiFi
        if (data.pasmo.pasmo24GHz === 1 && !compatibility.pasmo24GHz) {
          return false;
        }
        if (data.pasmo.pasmo5GHz === 1 && !compatibility.pasmo5GHz) {
          return false;
        }
        if (data.pasmo.pasmo6GHz === 1 && !compatibility.pasmo6GHz) {
          return false;
        }
        
        // Sprawdź czy wybrano przynajmniej jedno obsługiwane pasmo
        const hasValidBand = 
          (data.pasmo.pasmo24GHz === 1 && compatibility.pasmo24GHz) ||
          (data.pasmo.pasmo5GHz === 1 && compatibility.pasmo5GHz) ||
          (data.pasmo.pasmo6GHz === 1 && compatibility.pasmo6GHz);
        
        return hasValidBand;
      },
      { 
        message: 'Wybrane pasma nie są obsługiwane przez tę wersję WiFi',
        path: ['pasmo']
      }
    ).refine(
      (data) => {
        // Sprawdź czy prędkość nie przekracza maksymalnej dla wersji WiFi
        const version = data.wersja.wersja as keyof typeof WIFI_MAX_SPEEDS;
        const maxSpeed = WIFI_MAX_SPEEDS[version];
        
        return data.predkosc.predkosc <= maxSpeed;
      },
      (data) => ({
        message: `Maksymalna prędkość dla WiFi ${data.wersja.wersja} to ${WIFI_MAX_SPEEDS[data.wersja.wersja as keyof typeof WIFI_MAX_SPEEDS]} Mb/s`,
        path: ['predkosc', 'predkosc']
      })
    )),
  }).refine(
    (data) => {
      // Sprawdź minimum portów według typu urządzenia
      const deviceType = data.typ.typ_u as keyof typeof MIN_PORTS_BY_TYPE;
      const minPorts = MIN_PORTS_BY_TYPE[deviceType];
      
      if (minPorts && data.urzadzenie.ilosc_portow < minPorts) {
        return false;
      }
      
      return true;
    },
    (data) => {
      const deviceType = data.typ.typ_u as keyof typeof MIN_PORTS_BY_TYPE;
      const minPorts = MIN_PORTS_BY_TYPE[deviceType] || 1;
      return {
        message: `${deviceType} musi mieć minimum ${minPorts} portów`,
        path: ['urzadzenie', 'ilosc_portow']
      };
    }  ).refine(
    (data) => {
      // Dla urządzeń typu Switch, karty WiFi nie są wymagane
      if (data.typ.typ_u === 'Switch') {
        return true; // Switch może mieć puste karty WiFi
      }
      // Dla Access Point wymagana jest minimum jedna karta WiFi
      if (data.typ.typ_u === 'Access Point') {
        return data.karty_wifi && data.karty_wifi.length > 0;
      }
      // Dla innych typów urządzeń, sprawdź czy karty WiFi są poprawnie wypełnione jeśli istnieją
      if (data.karty_wifi && data.karty_wifi.length > 0) {
        return data.karty_wifi.every(karta => 
          karta.nazwa && karta.status && karta.wersja.wersja &&
          (karta.pasmo.pasmo24GHz === 1 || karta.pasmo.pasmo5GHz === 1 || karta.pasmo.pasmo6GHz === 1)
        );
      }
      return true; // Karty WiFi są opcjonalne dla Router i PC
    },
    (data) => ({
      message: data.typ.typ_u === 'Access Point' 
        ? 'Access Point musi mieć przynajmniej jedną kartę WiFi'
        : 'Karty WiFi muszą być poprawnie wypełnione',
      path: ['karty_wifi']
    })
  );
};

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
  karty_wifi: [], // Brak domyślnych kart WiFi - będą dodawane dynamicznie w zależności od typu urządzenia
  urzadzenie: { nazwa_urzadzenia: '', ilosc_portow: 1 },
  typ: { typ_u: '' },
  lokalizacja: { miejsce: '', szafa: '', rack: '' },
  mac: { MAC: '' },
};

// Funkcje pomocnicze eksportowane do użycia w komponentach
export const getCompatibleBands = (wifiVersion: string) => {
  return WIFI_BAND_COMPATIBILITY[wifiVersion as keyof typeof WIFI_BAND_COMPATIBILITY] || 
    { pasmo24GHz: false, pasmo5GHz: false, pasmo6GHz: false };
};

export const getMaxSpeedForWifiVersion = (wifiVersion: string) => {
  return WIFI_MAX_SPEEDS[wifiVersion as keyof typeof WIFI_MAX_SPEEDS] || 0;
};

export const getMinPortsForDeviceType = (deviceType: string) => {
  return MIN_PORTS_BY_TYPE[deviceType as keyof typeof MIN_PORTS_BY_TYPE] || 1;
};

export const getAllowedSpeedsForWifiVersion = (wifiVersion: string) => {
  const maxSpeed = getMaxSpeedForWifiVersion(wifiVersion);
  const commonSpeeds = [10, 11, 54, 100, 150, 300, 450, 600, 867, 1200, 1733, 2400, 3467, 4800, 6933, 9608, 46000];
  return commonSpeeds.filter(speed => speed <= maxSpeed);
};