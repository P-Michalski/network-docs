// src/hooks/useNetworkMap.ts
import { useMemo, useState } from 'react';
import type { DeviceDetails } from '../Models/DeviceDetails';

export const useNetworkMap = (devices: DeviceDetails[]) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceDetails | null>(null);  // Tworzenie nodes dla ReactFlow z hierarchicznym layoutem
  const nodes = useMemo(() => {
    // Najpierw zbierz wszystkie połączenia do analizy hierarchii
    const allConnections: any[] = [];
    
    devices.forEach(device => {
      // Port connections
      device.porty?.forEach(port => {
        port.polaczenia_portu?.forEach(conn => {
          const targetDevice = devices.find(d => d.porty?.some(p => p.id_p === conn.id_p_2));
          if (targetDevice && device.urzadzenie.id_u && targetDevice.urzadzenie.id_u) {
            allConnections.push({ 
              source: device.urzadzenie.id_u, 
              target: targetDevice.urzadzenie.id_u, 
              type: 'port' 
            });
          }
        });
      });
      
      // WiFi connections
      device.karty_wifi?.forEach(card => {
        card.polaczenia_karty?.forEach(conn => {
          const targetDevice = devices.find(d => d.karty_wifi?.some(k => k.id_k === conn.id_k_2));
          if (targetDevice && device.urzadzenie.id_u && targetDevice.urzadzenie.id_u) {
            allConnections.push({ 
              source: device.urzadzenie.id_u, 
              target: targetDevice.urzadzenie.id_u, 
              type: 'wifi' 
            });
          }
        });
      });
    });

    // Użyj hierarchicznego layoutu do obliczenia pozycji
    const layoutNodes = calculateHierarchicalLayout(devices, allConnections);
    
    // Stwórz finalne node'y z obliczonymi pozycjami
    return devices.map(device => {
      const layoutNode = layoutNodes.find(n => n.id === device.urzadzenie.id_u);
      return {
        id: device.urzadzenie.id_u?.toString() || 'unknown',
        type: 'deviceNode',
        position: { 
          x: layoutNode?.x || 150, 
          y: layoutNode?.y || 100 
        },
        data: {
          label: device.urzadzenie.nazwa_urzadzenia,
          type: device.typ?.typ_u,
          ports: device.porty || [],
          wifiCards: device.karty_wifi || [],
        }
      };
    });
  }, [devices]);
  // Tworzenie edges (połączeń) z offsetami dla równoległych połączeń
  const edges = useMemo(() => {
    const portEdges: any[] = [];
    const wifiEdges: any[] = [];
    const portEdgeSet = new Set<string>();
    const wifiEdgeSet = new Set<string>();

    devices.forEach(device => {
      // Port connections z unikalnymi kluczami
      device.porty?.forEach(port => {
        port.polaczenia_portu?.forEach(conn => {
          const targetDevice = devices.find(d => d.porty?.some(p => p.id_p === conn.id_p_2));
          if (targetDevice && device.urzadzenie.id_u && targetDevice.urzadzenie.id_u) {
            const key = [device.urzadzenie.id_u, targetDevice.urzadzenie.id_u].sort().join('-') + '-' + [port.id_p, conn.id_p_2].sort().join('-');
            if (!portEdgeSet.has(key)) {
              portEdgeSet.add(key);
              const targetPort = targetDevice.porty?.find(p => p.id_p === conn.id_p_2);
              portEdges.push({
                id: `port-${port.id_p}-${conn.id_p_2}`,
                source: device.urzadzenie.id_u.toString(),
                target: targetDevice.urzadzenie.id_u.toString(),
                sourceHandle: `port-out-${port.id_p}`,
                targetHandle: `port-in-${conn.id_p_2}`,
                animated: false,
                style: { stroke: '#1976d2', strokeWidth: 2 },
                label: `${port.nazwa} ↔ ${targetPort?.nazwa || ''}`,
                labelStyle: { fontSize: '10px', fontWeight: 'bold' },
                labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
              });
            }
          }
        });
      });

      // WiFi connections z unikalnymi kluczami
      device.karty_wifi?.forEach(card => {
        card.polaczenia_karty?.forEach(conn => {
          const targetDevice = devices.find(d => d.karty_wifi?.some(k => k.id_k === conn.id_k_2));
          if (targetDevice && device.urzadzenie.id_u && targetDevice.urzadzenie.id_u) {
            const key = [device.urzadzenie.id_u, targetDevice.urzadzenie.id_u].sort().join('-') + '-' + [card.id_k, conn.id_k_2].sort().join('-');
            if (!wifiEdgeSet.has(key)) {
              wifiEdgeSet.add(key);
              const targetCard = targetDevice.karty_wifi?.find(k => k.id_k === conn.id_k_2);
              wifiEdges.push({
                id: `wifi-${card.id_k}-${conn.id_k_2}`,
                source: device.urzadzenie.id_u.toString(),
                target: targetDevice.urzadzenie.id_u.toString(),
                sourceHandle: `wifi-out-${card.id_k}`,
                targetHandle: `wifi-in-${conn.id_k_2}`,
                animated: true,
                style: { stroke: '#fbc02d', strokeWidth: 2, strokeDasharray: '8 6' },
                label: `${card.nazwa} ↔ ${targetCard?.nazwa || ''}`,
                labelStyle: { fontSize: '10px', fontWeight: 'bold' },
                labelBgStyle: { fill: '#fff3e0', fillOpacity: 0.9 },
              });
            }
          }
        });
      });
    });

    // Przetwórz edges z offsetami dla równoległych połączeń
    return createEdgesWithOffsets(portEdges, wifiEdges);
  }, [devices]);
  const onNodeClick = (_event: any, node: any) => {
    const device = devices.find(d => d.urzadzenie.id_u?.toString() === node.id);
    setSelectedDevice(device || null);
  };
  // Hierarchiczny algorytm układania urządzeń na podstawie typów
  function calculateHierarchicalLayout(devices: any[], connections: any[]) {
    // Hierarchia typów urządzeń (poziom 1 = góra, wyższe = niżej)
    const deviceHierarchy: Record<string, number> = {
      'Router': 1,       // Główne urządzenia sieciowe
      'Switch': 2,       // Urządzenia pośrednie
      'Access Point': 3, // Punkty dostępowe
      'PC': 4           // Urządzenia końcowe
    };

    // Pogrupuj urządzenia według poziomów
    const devicesByLevel: Record<number, any[]> = {};
    devices.forEach(dev => {
      const level = deviceHierarchy[dev.typ?.typ_u] || 3;
      if (!devicesByLevel[level]) devicesByLevel[level] = [];
      devicesByLevel[level].push({
        id: dev.urzadzenie.id_u,
        type: dev.typ?.typ_u,
        device: dev
      });
    });

    const nodes: any[] = [];
    const levels = Object.keys(devicesByLevel).map(Number).sort();
    const canvasWidth = 1400;
    const canvasHeight = 800;
    
    // Rozmieść urządzenia poziom po poziomie
    levels.forEach((level, levelIndex) => {
      const devicesInLevel = devicesByLevel[level];
      const levelY = 120 + (levelIndex * (canvasHeight - 240) / Math.max(levels.length - 1, 1));
      
      // Sortuj urządzenia w poziomie na podstawie połączeń (najpierw te z większą liczbą połączeń)
      const devicesWithConnections = devicesInLevel.map(dev => {
        const portConnections = dev.device.porty?.reduce((sum: number, port: any) => 
          sum + (port.polaczenia_portu?.length || 0), 0) || 0;
        const wifiConnections = dev.device.karty_wifi?.reduce((sum: number, card: any) => 
          sum + (card.polaczenia_karty?.length || 0), 0) || 0;
        return {
          ...dev,
          connectionCount: portConnections + wifiConnections
        };
      }).sort((a, b) => b.connectionCount - a.connectionCount);

      // Rozmieść urządzenia poziomo
      devicesWithConnections.forEach((dev, deviceIndex) => {
        const totalDevices = devicesWithConnections.length;
        let x;
        
        if (totalDevices === 1) {
          x = canvasWidth / 2;
        } else {
          const spacing = Math.min(250, (canvasWidth - 200) / Math.max(totalDevices - 1, 1));
          const startX = (canvasWidth - (totalDevices - 1) * spacing) / 2;
          x = startX + (deviceIndex * spacing);
        }

        nodes.push({
          id: dev.id,
          x: x,
          y: levelY,
          type: dev.type,
          level: level,
          connectionCount: dev.connectionCount
        });
      });
    });

    // Optymalizacja pozycji na podstawie połączeń - przesuń urządzenia bliżej swoich połączeń
    const iterations = 30;
    for (let iter = 0; iter < iterations; iter++) {
      connections.forEach(conn => {
        const source = nodes.find(n => n.id === conn.source);
        const target = nodes.find(n => n.id === conn.target);
        
        if (source && target && source.level === target.level) {
          // Tylko dostosuj pozycje X dla urządzeń na tym samym poziomie
          const dx = target.x - source.x;
          const idealDistance = 220;
          
          if (Math.abs(dx) < idealDistance && Math.abs(dx) > 80) {
            const adjustment = (idealDistance - Math.abs(dx)) * 0.05;
            if (dx > 0) {
              source.x = Math.max(100, source.x - adjustment);
              target.x = Math.min(canvasWidth - 100, target.x + adjustment);
            } else {
              source.x = Math.min(canvasWidth - 100, source.x + adjustment);
              target.x = Math.max(100, target.x - adjustment);
            }
          }
        }
      });

      // Zapobiegnij nakładaniu się urządzeń na tym samym poziomie
      levels.forEach(level => {
        const levelNodes = nodes.filter(n => n.level === level).sort((a, b) => a.x - b.x);
        
        for (let i = 1; i < levelNodes.length; i++) {
          const prev = levelNodes[i - 1];
          const curr = levelNodes[i];
          const minDistance = 160;
          
          if (curr.x - prev.x < minDistance) {
            const overlap = minDistance - (curr.x - prev.x);
            prev.x = Math.max(100, prev.x - overlap / 2);
            curr.x = Math.min(canvasWidth - 100, curr.x + overlap / 2);
          }
        }
      });
    }

    return nodes;
  }
  // Funkcja do zarządzania równoległymi połączeniami
  function createEdgesWithOffsets(portEdges: any[], wifiEdges: any[]) {
    const processedEdges: any[] = [];
    
    // Przetwórz edges portów - używają swoich uchwytów
    portEdges.forEach(edge => {
      processedEdges.push({
        ...edge,
        type: 'straight',
      });
    });

    // Przetwórz edges WiFi - używają swoich uchwytów
    wifiEdges.forEach(edge => {
      processedEdges.push({
        ...edge,
        type: 'smoothstep',
      });
    });

    return processedEdges;
  }

  return {
    nodes,
    edges,
    selectedDevice,
    setSelectedDevice,
    onNodeClick
  };
};