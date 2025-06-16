import ReactFlow, { Background, Controls, MiniMap, Handle, Position } from 'react-flow-renderer';
import { FaServer, FaWifi, FaDesktop, FaNetworkWired } from 'react-icons/fa';
import { NodeBox, LegendContainer, LegendTitle, LegendItem, LegendLine, SidePanel, CloseButton, Tabs, TabButton, PanelTitle, PanelSection, PanelLabel, PanelNoData, PanelList } from '../components/NetworkMap/StyledNetworkMapComponents';
import { useState } from 'react';
import { useDevices } from '../../hooks/useDevices';
import { useNetworkMap } from '../../hooks/useNetworkMap';
import { useDeviceConnections } from '../../hooks/useDeviceConnections';

const iconMap: Record<string, React.ReactNode> = {
  'Router': <FaNetworkWired size={32} color="#1976d2" />,
  'Switch': <FaServer size={32} color="#388e3c" />,
  'PC': <FaDesktop size={32} color="#616161" />,
  'Access Point': <FaWifi size={32} color="#fbc02d" />,
};

const NetworkMapPage = () => {
  const { devices } = useDevices();
  const { nodes, edges, selectedDevice, setSelectedDevice, onNodeClick } = useNetworkMap(devices);
  const deviceConnections = useDeviceConnections(selectedDevice, devices);
  const [activeTab, setActiveTab] = useState<'all' | 'port' | 'wifi'>('all');

  // Custom node type for devices with dynamic handles
  const nodeTypes = {
    deviceNode: ({ data }: any) => {
      const { ports = [], wifiCards = [] } = data;
      
      return (
        <>
          {/* Dynamic handles for ports - left side */}
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
          
          {/* Dynamic handles for WiFi cards - top and bottom */}
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
          })}          <NodeBox deviceType={data.type}>
            {iconMap[data.type] || <FaServer size={32} color="#888" />}
            <div style={{ fontWeight: 600, marginTop: 4, fontSize: '14px' }}>{data.label}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{data.type}</div>
            {/* Show port and WiFi card counts */}
            <div style={{ fontSize: 9, color: '#666', marginTop: 2 }}>
              {ports.length > 0 && `${ports.length}P`}
              {ports.length > 0 && wifiCards.length > 0 && ' • '}
              {wifiCards.length > 0 && `${wifiCards.length}K`}
            </div>
          </NodeBox>
        </>
      );
    },
  };

  // Filter connections based on active tab
  let filteredConnections = deviceConnections.all;
  if (activeTab === 'port') {
    filteredConnections = deviceConnections.ports;
  } else if (activeTab === 'wifi') {
    filteredConnections = deviceConnections.wifi;
  }

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
          <CloseButton onClick={() => setSelectedDevice(null)} title="Zamknij panel">×</CloseButton>
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
                        Port <b>{conn.sourcePort}</b> → {conn.targetDevice} (Port {conn.targetPort})
                      </>
                    ) : (
                      <>
                        WiFi <b>{conn.sourceCard}</b> → {conn.targetDevice} (Karta {conn.targetCard})
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