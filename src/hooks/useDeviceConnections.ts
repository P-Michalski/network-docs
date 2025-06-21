// src/hooks/useDeviceConnections.ts
import { useMemo } from 'react';
import type { DeviceDetails } from '../Models/Interfaces/IDeviceDetails';

export const useDeviceConnections = (device: DeviceDetails | null, allDevices: DeviceDetails[]) => {
  const connections = useMemo(() => {
    if (!device) return { ports: [], wifi: [], all: [] };

    const portConnections = device.porty?.flatMap(port => 
      port.polaczenia_portu?.map(conn => {
        // Sprawdź czy aktualny port to id_p_1 czy id_p_2
        const isSourcePort = port.id_p === conn.id_p_1;
        const targetPortId = isSourcePort ? conn.id_p_2 : conn.id_p_1;
        
        const targetDevice = allDevices.find(d => 
          d.porty?.some(p => p.id_p === targetPortId)
        );
        
        return {
          type: 'port' as const,
          sourcePort: port.nazwa,
          targetDevice: targetDevice?.urzadzenie.nazwa_urzadzenia || 'Nieznane',
          targetPort: targetDevice?.porty?.find(p => p.id_p === targetPortId)?.nazwa || 'Nieznany'
        };
      }) || []
    ) || [];

    const wifiConnections = device.karty_wifi?.flatMap(card =>
      card.polaczenia_karty?.map(conn => {
        // Sprawdź czy aktualna karta to id_k_1 czy id_k_2
        const isSourceCard = card.id_k === conn.id_k_1;
        const targetCardId = isSourceCard ? conn.id_k_2 : conn.id_k_1;
        
        const targetDevice = allDevices.find(d =>
          d.karty_wifi?.some(c => c.id_k === targetCardId)
        );
        
        return {
          type: 'wifi' as const,
          sourceCard: card.nazwa,
          targetDevice: targetDevice?.urzadzenie.nazwa_urzadzenia || 'Nieznane',
          targetCard: targetDevice?.karty_wifi?.find(c => c.id_k === targetCardId)?.nazwa || 'Nieznana'
        };
      }) || []
    ) || [];

    return {
      ports: portConnections,
      wifi: wifiConnections,
      all: [...portConnections, ...wifiConnections]
    };
  }, [device, allDevices]);

  return connections;
};