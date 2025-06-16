import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import ReactFlow, { Background, Controls, MiniMap, Handle, Position } from 'react-flow-renderer';
import { FaServer, FaWifi, FaDesktop, FaNetworkWired } from 'react-icons/fa';
import styled from 'styled-components';
import { useMemo, useEffect, useState } from 'react';
import { fetchDevicesRequest } from '../../Update/Slices/devicesSlice';
import type { DeviceDetails } from '../../Models/DeviceDetails';
import type { Port } from '../../Models/Port';
import type { PortConnection } from '../../Models/PortConnection';
import type { WifiConnection } from '../../Models/WifiConnection';
import type { WifiCard } from '../../Models/WifiCard';

const iconMap: Record<string, React.ReactNode> = {
  'Router': <FaNetworkWired size={32} color="#1976d2" />,
  'Switch': <FaServer size={32} color="#388e3c" />,
  'PC': <FaDesktop size={32} color="#616161" />,
  'Access Point': <FaWifi size={32} color="#fbc02d" />,
};

const LegendContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  width: 200px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-size: 12px;
  z-index: 3000;
  max-width: 200px;
`;

const LegendTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const LegendItem = styled.div<{ color: string; borderColor: string }>`
  display: flex;
  align-items: center;
  margin: 4px 0;
  
  &::before {
    content: '';
    width: 16px;
    height: 12px;
    background: ${props => props.color};
    border: 2px solid ${props => props.borderColor};
    border-radius: 3px;
    margin-right: 8px;
  }
`;

const LegendLine = styled.div<{ color: string; dashed?: boolean }>`
  display: inline-block;
  width: 32px;
  height: 0;
  border-top: 4px ${props => props.dashed ? 'dashed' : 'solid'} ${props => props.color};
  margin-right: 8px;
  vertical-align: middle;
`;

const NodeBox = styled.div<{ deviceType?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background: ${props => {
    switch (props.deviceType) {
      case 'Router': return '#e3f2fd';     // Jasny niebieski
      case 'Switch': return '#e8f5e8';     // Jasny zielony  
      case 'Access Point': return '#fff8e1'; // Jasny żółty
      case 'PC': return '#f5f5f5';         // Jasny szary
      default: return '#fff';
    }
  }};
  border: 2px solid ${props => {
    switch (props.deviceType) {
      case 'Router': return '#1976d2';     // Niebieski
      case 'Switch': return '#388e3c';     // Zielony
      case 'Access Point': return '#fbc02d'; // Żółty
      case 'PC': return '#616161';         // Szary
      default: return '#1976d2';
    }
  }};
  border-radius: 12px;
  min-width: 80px;
  box-shadow: 0 2px 8px #0001;
`;

// Hierarchiczny algorytm układania urządzeń na podstawie typów
const calculateHierarchicalLayout = (devices: any[], connections: any[]) => {
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
};

// Funkcja do zarządzania równoległymi połączeniami
const createEdgesWithOffsets = (portEdges: any[], wifiEdges: any[]) => {
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
};

const SidePanel = styled.div`
  position: fixed;
  top: 90px;
  left: 0;
  width: 340px;
  height: calc(100vh - 100px);
  background: #f7fafd;
  border-right: 2px solid #1976d2;
  box-shadow: 2px 0 12px #0002;
  padding: 28px 22px 22px 22px;
  z-index: 2000;
  overflow-y: auto;
  border-radius: 0 18px 18px 0;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px #1976d2aa;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #1976d2;
    color: #fff;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
`;

const TabButton = styled.button<{ active?: boolean }>`
  padding: 7px 18px;
  border: none;
  border-radius: 16px 16px 0 0;
  background: ${({ active }) => (active ? '#1976d2' : '#e3f2fd')};
  color: ${({ active }) => (active ? '#fff' : '#1976d2')};
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  box-shadow: ${({ active }) => (active ? '0 2px 8px #1976d2aa' : 'none')};
  transition: background 0.2s, color 0.2s;
  outline: none;
`;

const PanelTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #1976d2;
  letter-spacing: 0.5px;
`;

const PanelSection = styled.div`
  margin-bottom: 18px;
`;

const PanelLabel = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
`;

const PanelList = styled.ul`
  margin: 0 0 0 12px;
  padding: 0;
  font-size: 15px;
  color: #444;
  list-style: disc inside;
`;

const PanelNoData = styled.div`
  color: #888;
  font-size: 15px;
  margin-top: 10px;
`;

const NetworkMapPage = () => {
  const dispatch = useDispatch();
  const devices = useSelector((state: RootState) => state.devices.devices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Pobierz urządzenia jeśli nie są załadowane
  useEffect(() => {
    if (!devices || devices.length === 0) {
      dispatch(fetchDevicesRequest());
    }
  }, [devices, dispatch]);

  // DEBUG: sprawdź strukturę danych
  console.log('=== NETWORK MAP DEBUG ===');
  console.log('devices:', devices);
  console.log('devices length:', devices.length);
  devices.forEach((dev, idx) => {
    console.log(`Device ${idx}:`, {
      id: dev.urzadzenie.id_u,
      name: dev.urzadzenie.nazwa_urzadzenia,
      type: dev.typ?.typ_u,
      ports: dev.porty?.length || 0,
      wifi_cards: dev.karty_wifi?.length || 0,
    });
    dev.porty?.forEach((port, pidx) => {
      console.log(`  Port ${pidx}:`, {
        id: port.id_p,
        name: port.nazwa,
        connections: port.polaczenia_portu?.length || 0,
        connections_data: port.polaczenia_portu,
      });
    });
    dev.karty_wifi?.forEach((card, cidx) => {
      console.log(`  WiFi Card ${cidx}:`, {
        id: card.id_k,
        name: card.nazwa,
        connections: card.polaczenia_karty?.length || 0,
        connections_data: card.polaczenia_karty,
      });
    });
  });
  // Mapuj urządzenia na node'y z inteligentnym layoutem
  const { nodes, edges } = useMemo(() => {
    // Najpierw zbierz wszystkie połączenia
    const allConnections: any[] = [];
    const portEdges: any[] = [];
    const wifiEdges: any[] = [];
    const portEdgeSet = new Set<string>();
    const wifiEdgeSet = new Set<string>();

    // Zbierz port connections
    devices.forEach(dev => {
      dev.porty?.forEach(port => {
        port.polaczenia_portu?.forEach((conn: any) => {
          const targetDev = devices.find(d => d.porty?.some(p => p.id_p === conn.id_p_2));
          if (targetDev && dev.urzadzenie.id_u !== targetDev.urzadzenie.id_u) {
            const key = [dev.urzadzenie.id_u, targetDev.urzadzenie.id_u].sort().join('-') + '-' + [port.id_p, conn.id_p_2].sort().join('-');
            if (!portEdgeSet.has(key)) {
              portEdgeSet.add(key);              const edge = {
                id: `port-${port.id_p}-${conn.id_p_2}`,
                source: Number(dev.urzadzenie.id_u),
                target: Number(targetDev.urzadzenie.id_u),
                sourceHandle: `port-out-${port.id_p}`,
                targetHandle: `port-in-${conn.id_p_2}`,
                animated: false,
                style: { stroke: '#1976d2', strokeWidth: 2 },
                label: `${port.nazwa} ↔ ${targetDev.porty.find(p => p.id_p === conn.id_p_2)?.nazwa || ''}`,
                labelStyle: { fontSize: '10px', fontWeight: 'bold' },
                labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
              };
              portEdges.push(edge);
              allConnections.push({ source: edge.source, target: edge.target, type: 'port' });
            }
          }
        });
      });
    });

    // Zbierz wifi connections
    devices.forEach(dev => {
      dev.karty_wifi?.forEach(card => {
        card.polaczenia_karty?.forEach((conn: any) => {
          const targetDev = devices.find(d => d.karty_wifi?.some(k => k.id_k === conn.id_k_2));
          if (targetDev && dev.urzadzenie.id_u !== targetDev.urzadzenie.id_u) {
            const key = [dev.urzadzenie.id_u, targetDev.urzadzenie.id_u].sort().join('-') + '-' + [card.id_k, conn.id_k_2].sort().join('-');
            if (!wifiEdgeSet.has(key)) {
              wifiEdgeSet.add(key);              const edge = {
                id: `wifi-${card.id_k}-${conn.id_k_2}`,
                source: Number(dev.urzadzenie.id_u),
                target: Number(targetDev.urzadzenie.id_u),
                sourceHandle: `wifi-out-${card.id_k}`,
                targetHandle: `wifi-in-${conn.id_k_2}`,
                animated: true,
                style: { stroke: '#fbc02d', strokeWidth: 2, strokeDasharray: '8 6' },
                label: `${card.nazwa} ↔ ${targetDev.karty_wifi.find(k => k.id_k === conn.id_k_2)?.nazwa || ''}`,
                labelStyle: { fontSize: '10px', fontWeight: 'bold' },
                labelBgStyle: { fill: '#fff3e0', fillOpacity: 0.9 },
              };
              wifiEdges.push(edge);
              allConnections.push({ source: edge.source, target: edge.target, type: 'wifi' });
            }
          }
        });
      });
    });    // Użyj hierarchiczny layout do obliczenia pozycji
    const layoutNodes = calculateHierarchicalLayout(devices, allConnections);
      // Stwórz finalne node'y z obliczonymi pozycjami
    const finalNodes = devices.map(dev => {
      const layoutNode = layoutNodes.find(n => n.id === dev.urzadzenie.id_u);
      return {
        id: String(dev.urzadzenie.id_u),
        type: 'deviceNode',
        position: { 
          x: layoutNode?.x || 150, 
          y: layoutNode?.y || 100 
        },
        data: {
          label: dev.urzadzenie.nazwa_urzadzenia,
          icon: iconMap[dev.typ?.typ_u] || <FaServer size={32} color="#888" />,
          type: dev.typ?.typ_u,
          ports: dev.porty || [],
          wifiCards: dev.karty_wifi || [],
        },
      };
    });

    // Przetwórz edges z offsetami dla równoległych połączeń
    const processedEdges = createEdgesWithOffsets(
      portEdges.map(e => ({ ...e, source: String(e.source), target: String(e.target) })),
      wifiEdges.map(e => ({ ...e, source: String(e.source), target: String(e.target) }))
    );

    console.log('Final nodes:', finalNodes);
    console.log('Final edges:', processedEdges);

    return { nodes: finalNodes, edges: processedEdges };
  }, [devices]);  // Custom node dla urządzenia z dynamicznymi uchwytami
  const nodeTypes = {
    deviceNode: ({ data }: any) => {
      const { ports = [], wifiCards = [] } = data;
      
      return (
        <>
          {/* Dynamiczne uchwyty dla portów - po lewej stronie */}
          {ports.map((port: any, index: number) => {
            const topPosition = 20 + (index * (60 / Math.max(ports.length - 1, 1)));
            return (
              <>
                <Handle
                  key={`port-out-${port.id_p}`}
                  type="source"
                  position={Position.Left}
                  id={`port-out-${port.id_p}`}
                  style={{ 
                    background: '#1976d2', 
                    top: `${topPosition}%`,
                    width: '8px',
                    height: '8px'
                  }}
                />
                <Handle
                  key={`port-in-${port.id_p}`}
                  type="target"
                  position={Position.Right}
                  id={`port-in-${port.id_p}`}
                  style={{ 
                    background: '#1976d2', 
                    top: `${topPosition}%`,
                    width: '8px',
                    height: '8px'
                  }}
                />
              </>
            );
          })}
          
          {/* Dynamiczne uchwyty dla kart WiFi - góra i dół */}
          {wifiCards.map((card: any, index: number) => {
            const leftPosition = 20 + (index * (60 / Math.max(wifiCards.length - 1, 1)));
            return (
              <>
                <Handle
                  key={`wifi-out-${card.id_k}`}
                  type="source"
                  position={Position.Top}
                  id={`wifi-out-${card.id_k}`}
                  style={{ 
                    background: '#fbc02d', 
                    left: `${leftPosition}%`,
                    width: '8px',
                    height: '8px'
                  }}
                />
                <Handle
                  key={`wifi-in-${card.id_k}`}
                  type="target"
                  position={Position.Bottom}
                  id={`wifi-in-${card.id_k}`}
                  style={{ 
                    background: '#fbc02d', 
                    left: `${leftPosition}%`,
                    width: '8px',
                    height: '8px'
                  }}
                />
              </>
            );
          })}
            <NodeBox deviceType={data.type}>
            {data.icon}
            <div style={{ fontWeight: 600, marginTop: 4, fontSize: '14px' }}>{data.label}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{data.type}</div>
            {/* Pokaż liczbę portów i kart WiFi */}
            <div style={{ fontSize: 9, color: '#666', marginTop: 2 }}>
              {ports.length > 0 && `${ports.length}P`}
              {ports.length > 0 && wifiCards.length > 0 && ' • '}
              {wifiCards.length > 0 && `${wifiCards.length}K`}
            </div>
          </NodeBox>
        </>
      );
    },
  };  // Wybrane urządzenie i jego połączenia (przenieś bliżej rendera)
  const selectedDevice = devices.find(dev => String(dev.urzadzenie.id_u) === selectedDeviceId);
  let deviceConnections: any[] = [];
  if (selectedDevice) {
    selectedDevice.porty?.forEach(port => {
      port.polaczenia_portu?.forEach((conn: PortConnection) => {
        deviceConnections.push({
          type: 'port',
          portName: port.nazwa,
          targetDevice: devices.find((d: DeviceDetails) => d.porty?.some((p: Port) => p.id_p === conn.id_p_2)),
          targetPort: conn.id_p_2
        });
      });
    });
    selectedDevice.karty_wifi?.forEach(card => {
      card.polaczenia_karty?.forEach((conn: WifiConnection) => {
        deviceConnections.push({
          type: 'wifi',
          cardName: card.nazwa,
          targetDevice: devices.find((d: DeviceDetails) => d.karty_wifi?.some((k: WifiCard) => k.id_k === conn.id_k_2)),
          targetCard: conn.id_k_2
        });
      });
    });
  }

  // Zakładki panelu bocznego
  const [activeTab, setActiveTab] = useState<'all' | 'port' | 'wifi'>('all');

  // Filtrowane połączenia do wyświetlenia
  let filteredConnections = deviceConnections;
  if (activeTab === 'port') {
    filteredConnections = deviceConnections.filter(c => c.type === 'port');
  } else if (activeTab === 'wifi') {
    filteredConnections = deviceConnections.filter(c => c.type === 'wifi');
  }

  const onNodeClick = (_: any, node: any) => {
    setSelectedDeviceId(node.id);
  };

  return (
    <div style={{ width: '100vw', height: '80vh', background: '#e3f2fd', position: 'relative' }}>
      <LegendContainer>
        <LegendTitle>Hierarchia sieci</LegendTitle>
        <LegendItem color="#e3f2fd" borderColor="#1976d2">Router</LegendItem>
        <LegendItem color="#e8f5e8" borderColor="#388e3c">Switch</LegendItem>
        <LegendItem color="#fff8e1" borderColor="#fbc02d">Access Point</LegendItem>
        <LegendItem color="#f5f5f5" borderColor="#616161">PC</LegendItem>
        <div style={{ margin: '10px 0 0 0', fontWeight: 600, color: '#1976d2' }}>Połączenia:</div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '6px 0 0 0', fontSize: 13 }}>
          <LegendLine color="#1976d2" />
          <span style={{ color: '#1976d2', marginRight: 10 }}>Port</span>
          <LegendLine color="#fbc02d" dashed />
          <span style={{ color: '#fbc02d' }}>WiFi</span>
        </div>
      </LegendContainer>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag
        zoomOnScroll
        onNodeClick={onNodeClick}
      >
        <MiniMap />
        <Controls />
        <Background gap={16} color="#b3e5fc" />
      </ReactFlow>
      {selectedDevice && (
        <SidePanel>
          <CloseButton onClick={() => setSelectedDeviceId(null)} title="Zamknij panel">×</CloseButton>
          <PanelTitle>{selectedDevice.urzadzenie.nazwa_urzadzenia}</PanelTitle>
          <PanelSection>
            <PanelLabel>Typ:</PanelLabel>
            <div>{selectedDevice.typ?.typ_u}</div>
          </PanelSection>
          <Tabs>
            <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>Wszystkie</TabButton>
            <TabButton active={activeTab === 'port'} onClick={() => setActiveTab('port')}>Porty</TabButton>
            <TabButton active={activeTab === 'wifi'} onClick={() => setActiveTab('wifi')}>WiFi</TabButton>
          </Tabs>
          <PanelSection>
            <PanelLabel>Połączenia:</PanelLabel>
            {filteredConnections.length === 0 ? (
              <PanelNoData>Brak połączeń</PanelNoData>
            ) : (
              <PanelList>
                {filteredConnections.map((conn, idx) => (
                  <li key={idx}>
                    {conn.type === 'port' ? (
                      <>
                        Port <b>{conn.portName}</b> → {conn.targetDevice?.urzadzenie.nazwa_urzadzenia || 'Nieznane'}
                      </>
                    ) : (
                      <>
                        WiFi <b>{conn.cardName}</b> → {conn.targetDevice?.urzadzenie.nazwa_urzadzenia || 'Nieznane'}
                      </>
                    )}
                  </li>
                ))}
              </PanelList>
            )}
          </PanelSection>
        </SidePanel>
      )}
    </div>
  );
};

export default NetworkMapPage;