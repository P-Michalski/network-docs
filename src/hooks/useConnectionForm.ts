import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const useConnectionForm = () => {
  const devices = useSelector((state: RootState) => state.devices.devices);
  
  const [connectionType, setConnectionType] = useState<'port' | 'wifi'>('port');
  const [device1, setDevice1] = useState<number | ''>('');
  const [device2, setDevice2] = useState<number | ''>('');
  const [portOrCard1, setPortOrCard1] = useState<number | ''>('');
  const [portOrCard2, setPortOrCard2] = useState<number | ''>('');
  const [success, setSuccess] = useState<string | null>(null);

  // Dynamic device objects
  const device1Obj = useMemo(() => devices.find(d => d.urzadzenie.id_u === device1), [devices, device1]);
  const device2Obj = useMemo(() => devices.find(d => d.urzadzenie.id_u === device2), [devices, device2]);

  // Available ports/cards lists
  const allPorts1 = useMemo(() => device1Obj?.porty || [], [device1Obj]);
  const allPorts2 = useMemo(() => device2Obj?.porty || [], [device2Obj]);
  const allCards1 = useMemo(() => device1Obj?.karty_wifi || [], [device1Obj]);
  const allCards2 = useMemo(() => device2Obj?.karty_wifi || [], [device2Obj]);

  // Helper functions for port/card availability
  const isPortOccupied = (portId: number, deviceId: number) => {
    const device = devices.find(d => d.urzadzenie.id_u === deviceId);
    const port = device?.porty?.find(p => p.id_p === portId);
    return port?.polaczenia_portu && port.polaczenia_portu.length > 0;
  };

  const isWifiCardOccupied = (cardId: number, deviceId: number) => {
    const device = devices.find(d => d.urzadzenie.id_u === deviceId);
    const card = device?.karty_wifi?.find(c => c.id_k === cardId);
    return card?.polaczenia_karty && card.polaczenia_karty.length > 0;
  };

  // Available (unoccupied) ports/cards
  const availablePorts1 = useMemo(() => 
    allPorts1.filter(port => !isPortOccupied(port.id_p, device1 as number)),
    [allPorts1, device1, devices]
  );

  const availablePorts2 = useMemo(() => 
    allPorts2.filter(port => !isPortOccupied(port.id_p, device2 as number)),
    [allPorts2, device2, devices]
  );

  const availableCards1 = useMemo(() => 
    allCards1.filter(card => !isWifiCardOccupied(card.id_k, device1 as number)),
    [allCards1, device1, devices]
  );

  const availableCards2 = useMemo(() => {
    if (!portOrCard1) return allCards2.filter(card => !isWifiCardOccupied(card.id_k, device2 as number));
    
    // For WiFi, exclude cards already connected to selected card
    const connectedIds = new Set<number>();
    const selectedCard = allCards1.find(c => c.id_k === portOrCard1);
    selectedCard?.polaczenia_karty?.forEach((conn: any) => {
      if (conn.id_k_1 && conn.id_k_1 !== portOrCard1) connectedIds.add(conn.id_k_1);
      if (conn.id_k_2 && conn.id_k_2 !== portOrCard1) connectedIds.add(conn.id_k_2);
    });
    
    return allCards2.filter(card => 
      !isWifiCardOccupied(card.id_k, device2 as number) &&
      card.id_k !== portOrCard1 && 
      !connectedIds.has(card.id_k)
    );
  }, [allCards2, device2, devices, portOrCard1, allCards1]);

  // Reset form
  const resetForm = () => {
    setDevice1('');
    setDevice2('');
    setPortOrCard1('');
    setPortOrCard2('');
    setSuccess(null);
  };

  // Handle field changes with dependent field resets
  const handleConnectionTypeChange = (newType: 'port' | 'wifi') => {
    setConnectionType(newType);
    setPortOrCard1('');
    setPortOrCard2('');
    setDevice1('');
    setDevice2('');
  };

  const handleDevice1Change = (newDevice1: number | '') => {
    setDevice1(newDevice1);
    if (device2 === newDevice1) {
      setDevice2('');
      setPortOrCard2('');
    }
    setPortOrCard1('');
  };

  const handleDevice2Change = (newDevice2: number | '') => {
    setDevice2(newDevice2);
    if (device1 === newDevice2) {
      setDevice1('');
      setPortOrCard1('');
    }
    setPortOrCard2('');
  };
  return {
    // State
    connectionType,
    device1,
    device2,
    portOrCard1,
    portOrCard2,
    success,
    
    // Derived data
    devices,
    device1Obj,
    device2Obj,
    allPorts1,
    allPorts2,
    allCards1,
    allCards2,
    availablePorts1,
    availablePorts2,
    availableCards1,
    availableCards2,
    
    // Actions
    setConnectionType: handleConnectionTypeChange,
    setDevice1: handleDevice1Change,
    setDevice2: handleDevice2Change,
    setPortOrCard1,
    setPortOrCard2,
    setSuccess,
    resetForm,
    
    // Helper functions
    isPortOccupied,
    isWifiCardOccupied
  };
};
