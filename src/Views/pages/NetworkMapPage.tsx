import ReactFlow, { Background, Controls, MiniMap } from 'react-flow-renderer';
import { useState } from 'react';
import { useDevices } from '../../hooks/useDevices';
import { useNetworkMap } from '../../hooks/useNetworkMap';
import { useDeviceConnections } from '../../hooks/useDeviceConnections';
import { DeviceNode } from '../components/NetworkMap/DeviceNode';
import { NetworkLegend } from '../components/NetworkMap/NetworkLegend';
import { DeviceInfoPanel } from '../components/NetworkMap/DeviceInfoPanel';
import { NetworkMapContainer } from '../components/NetworkMap/StyledNetworkMapComponents';
import LoadingComponent from '../components/Loading/LoadingComponent';
import DatabaseErrorComponent from '../components/Error/DatabaseErrorComponent';

const NetworkMapPage = () => {
  const { devices, loading, error, fetchDevices } = useDevices();
  const { nodes, edges, selectedDevice, setSelectedDevice, onNodeClick } = useNetworkMap(devices);
  const deviceConnections = useDeviceConnections(selectedDevice, devices);
  const [activeTab, setActiveTab] = useState<'all' | 'port' | 'wifi'>('all');
  
  // Sprawdzenie stanów loading i error (po wszystkich hookach!)
  if (loading) {
    return <LoadingComponent message="Ładowanie mapy sieci..." subtext="Tworzenie wizualizacji połączeń między urządzeniami." />;
  }
  
  if (error) {
    return (
      <DatabaseErrorComponent 
        error={error} 
        onRetry={fetchDevices}
        showTechnicalDetails={true}
      />
    );
  }

  // Custom node type for devices with dynamic handles
  const nodeTypes = {
    deviceNode: DeviceNode,
  };

  // Filter connections based on active tab
  let filteredConnections = deviceConnections.all;
  if (activeTab === 'port') {
    filteredConnections = deviceConnections.ports;  } else if (activeTab === 'wifi') {
    filteredConnections = deviceConnections.wifi;
  }
  
  return (
    <NetworkMapContainer>
      <NetworkLegend />
      
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
        <DeviceInfoPanel
          selectedDevice={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredConnections={filteredConnections}
        />
      )}
    </NetworkMapContainer>
  );
};

export default NetworkMapPage;