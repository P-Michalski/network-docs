import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const useConnectionsList = () => {
  const devices = useSelector((state: RootState) => state.devices.devices);
  const [panelTab, setPanelTab] = useState<'port' | 'wifi' | 'all'>('all');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);

  // Get all connections with deduplication
  const allConnections = useMemo(() => {
    const seenConnections = new Set<string>();

    const portConnections = devices.flatMap(device =>
      device.porty?.flatMap(port =>
        port.polaczenia_portu?.map((conn: any) => {
          const otherDevice = devices.find(d => 
            d.porty?.some(p => p.id_p === conn.id_p_2)
          );
          const otherPort = otherDevice?.porty?.find(p => p.id_p === conn.id_p_2);
          
          // Avoid self-connections
          if (device.urzadzenie.id_u === otherDevice?.urzadzenie.id_u) {
            return null;
          }
          
          // Create unique key to avoid duplicates
          const connectionKey = [port.id_p, conn.id_p_2].sort((a, b) => a - b).join('-');
          
          if (seenConnections.has(connectionKey)) {
            return null;
          }
          seenConnections.add(connectionKey);
          
          return {
            type: 'port' as const,
            device1: device.urzadzenie.nazwa_urzadzenia,
            device2: otherDevice?.urzadzenie.nazwa_urzadzenia || 'Nieznane',
            port1: port.nazwa,
            port2: otherPort?.nazwa || 'Nieznany',
            id_p_1: port.id_p,
            id_p_2: conn.id_p_2,
            ...conn
          };
        }).filter(Boolean) || []
      ) || []
    );

    const wifiConnections = devices.flatMap(device =>
      device.karty_wifi?.flatMap(card =>
        card.polaczenia_karty?.map((conn: any) => {
          const otherDevice = devices.find(d => 
            d.karty_wifi?.some(c => c.id_k === conn.id_k_2)
          );
          const otherCard = otherDevice?.karty_wifi?.find(c => c.id_k === conn.id_k_2);
          
          // Avoid self-connections
          if (device.urzadzenie.id_u === otherDevice?.urzadzenie.id_u) {
            return null;
          }
          
          // Create unique key to avoid duplicates
          const connectionKey = [card.id_k, conn.id_k_2].sort((a, b) => a - b).join('-');
          
          if (seenConnections.has(connectionKey)) {
            return null;
          }
          seenConnections.add(connectionKey);
          
          return {
            type: 'wifi' as const,
            device1: device.urzadzenie.nazwa_urzadzenia,
            device2: otherDevice?.urzadzenie.nazwa_urzadzenia || 'Nieznane',
            card1: card.nazwa,
            card2: otherCard?.nazwa || 'Nieznana',
            id_k_1: card.id_k,
            id_k_2: conn.id_k_2,
            ...conn
          };
        }).filter(Boolean) || []
      ) || []
    );

    return [...portConnections, ...wifiConnections];
  }, [devices]);

  // Filtered connections based on panel tab
  const filteredConnections = useMemo(() => {
    if (panelTab === 'all') return allConnections;
    return allConnections.filter(conn => conn.type === panelTab);
  }, [allConnections, panelTab]);

  // Info panel handlers
  const handleShowInfo = (connection: any) => {
    setSelectedConnection(connection);
    setShowInfoPanel(true);
  };

  const handleCloseInfo = () => {
    setShowInfoPanel(false);
    setSelectedConnection(null);
  };

  return {
    allConnections,
    filteredConnections,
    panelTab,
    setPanelTab,
    showInfoPanel,
    selectedConnection,
    handleShowInfo,
    handleCloseInfo
  };
};
