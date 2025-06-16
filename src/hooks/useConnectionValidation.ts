import { useState } from 'react';

interface ValidationErrors {
  device1?: string;
  device2?: string;
  portOrCard1?: string;
  portOrCard2?: string;
  general?: string;
}

export const useConnectionValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [hasValidated, setHasValidated] = useState(false);

  // Speed calculation functions
  const getMaxWifiSpeed = (card1: any, card2: any) => {
    const speed1 = card1?.predkosc?.predkosc;
    const speed2 = card2?.predkosc?.predkosc;
    
    if (!speed1 || !speed2) return 'brak';
    
    const minSpeed = Math.min(speed1, speed2);
    return `${minSpeed}Mb/s`;
  };

  const getCommonBand = (card1: any, card2: any) => {
    if (card1.pasmo?.pasmo6GHz && card2.pasmo?.pasmo6GHz) return '6GHz';
    if (card1.pasmo?.pasmo5GHz && card2.pasmo?.pasmo5GHz) return '5GHz';
    if (card1.pasmo?.pasmo24GHz && card2.pasmo?.pasmo24GHz) return '2.4GHz';
    return 'brak';
  };

  const getMaxPortSpeed = (port1: any, port2: any) => {
    const speed1 = port1?.predkosc_portu?.predkosc;
    const speed2 = port2?.predkosc_portu?.predkosc;
    
    if (!speed1 || !speed2) return 'brak';
    
    const speedToMbps = (speed: string): number => {
      const numPart = parseFloat(speed.replace(/[^\d,]/g, '').replace(',', '.'));
      if (speed.includes('Gb/s')) return numPart * 1000;
      if (speed.includes('Mb/s')) return numPart;
      return 0;
    };
    
    const speed1Mbps = speedToMbps(speed1);
    const speed2Mbps = speedToMbps(speed2);
    
    return speed1Mbps <= speed2Mbps ? speed1 : speed2;
  };

  // Validation function
  const validateForm = (
    connectionType: 'port' | 'wifi',
    device1: number | '',
    device2: number | '',
    portOrCard1: number | '',
    portOrCard2: number | '',
    device1Obj: any,
    device2Obj: any,
    showAllErrors = false
  ) => {
    const errors: ValidationErrors = {};
    
    if (!device1) {
      errors.device1 = 'Wybierz pierwsze urządzenie';
    }
    
    if (!device2) {
      errors.device2 = 'Wybierz drugie urządzenie';
    }
    
    if (device1 && !portOrCard1) {
      errors.portOrCard1 = connectionType === 'port' 
        ? 'Wybierz port dla pierwszego urządzenia'
        : 'Wybierz kartę WiFi dla pierwszego urządzenia';
    }
    
    if (device2 && !portOrCard2) {
      errors.portOrCard2 = connectionType === 'port'
        ? 'Wybierz port dla drugiego urządzenia'
        : 'Wybierz kartę WiFi dla drugiego urządzenia';
    }
    
    // Sprawdź czy to nie to samo urządzenie
    if (device1 && device2 && device1 === device2) {
      errors.general = 'Nie można połączyć urządzenia z samym sobą';
    }
    
    // Sprawdź pasmo WiFi
    if (connectionType === 'wifi' && portOrCard1 && portOrCard2 && device1 && device2) {
      const card1 = device1Obj?.karty_wifi?.find((c: any) => c.id_k === portOrCard1);
      const card2 = device2Obj?.karty_wifi?.find((c: any) => c.id_k === portOrCard2);
      const commonBand = getCommonBand(card1, card2);
      if (commonBand === 'brak') {
        errors.general = 'Karty WiFi nie mają wspólnego pasma';
      }
    }
    
    if (showAllErrors || hasValidated) {
      setValidationErrors(errors);
    }
    
    return errors;
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
    setHasValidated(false);
  };

  return {
    validationErrors,
    hasValidated,
    setValidationErrors,
    setHasValidated,
    validateForm,
    clearValidationErrors,
    getMaxWifiSpeed,
    getCommonBand,
    getMaxPortSpeed
  };
};
