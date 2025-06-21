import { MainContainer, DeviceForm, Button } from '../components/DeviceForm/styled';
import { useConnectionManager } from '../../hooks/useConnectionManager';
import { useDevices } from '../../hooks/useDevices';
import { ConnectionTypeSelector } from '../components/ConnectionForm/ConnectionTypeSelector';
import { DeviceSelector } from '../components/ConnectionForm/DeviceSelector';
import { ConnectionInfo } from '../components/ConnectionForm/ConnectionInfo';
import { ConnectionsList } from '../components/ConnectionForm/ConnectionsList';
import { ConnectionInfoModal } from '../components/ConnectionForm/ConnectionInfoModal';
import { FormMessages } from '../components/ConnectionForm/FormMessages';
import LoadingComponent from '../components/Loading';
import DatabaseErrorComponent from '../components/Error';

const ConnectionManagerPage = () => {
  // Stan loading/error z devicesSlice
  const { loading: devicesLoading, error: devicesError, fetchDevices } = useDevices();
    const {
    // Form state
    connectionType,
    device1,
    device2,
    portOrCard1,
    portOrCard2,
    success,
    devices,
    device1Obj,
    device2Obj,
    allPorts1,
    allPorts2,
    availablePorts1,
    availablePorts2,
    availableCards1,
    availableCards2,
    
    // Validation state
    validationErrors,
      // Connections list state
    allConnections,
    filteredConnections,
    panelTab,
    showInfoPanel,
    selectedConnection,
    
    // Operation loading/error (dla dodawania/usuwania połączeń)
    connectionsLoading: operationLoading,
    connectionsError: operationError,
    
    // Actions
    setConnectionType,
    setDevice1,
    setDevice2,
    setPortOrCard1,
    setPortOrCard2,
    setPanelTab,
    handleAddConnection,
    handleRemoveConnection,
    handleShowInfo,
    handleCloseInfo,
    
    // Helper functions
    isPortOccupied,
    areDevicesConnected
  } = useConnectionManager();
  
  // Sprawdzenie stanów loading i error z devicesSlice (po wszystkich hookach!)
  if (devicesLoading && devices.length === 0) {
    return <LoadingComponent message="Ładowanie urządzeń..." subtext="Pobieranie danych o urządzeniach do zarządzania połączeniami." />;
  }
  
  if (devicesError) {
    return (
      <DatabaseErrorComponent 
        error={devicesError} 
        onRetry={fetchDevices}
        showTechnicalDetails={true}
      />
    );
  }
  
  return (    <MainContainer>      
      <DeviceForm onSubmit={handleAddConnection}>
        <h2>Nowe połączenie</h2>
        
        <FormMessages 
          generalError={validationErrors.general}
          operationError={operationError}
          success={success}
          operationLoading={operationLoading}
        />

        <ConnectionTypeSelector 
          connectionType={connectionType}
          onConnectionTypeChange={setConnectionType}
        />

        <DeviceSelector 
          title="Pierwsze urządzenie"
          devices={devices}
          selectedDevice={device1}
          onDeviceChange={setDevice1}
          connectionType={connectionType}
          selectedPortOrCard={portOrCard1}
          onPortOrCardChange={setPortOrCard1}
          allPorts={allPorts1}
          availableCards={availableCards1}
          isPortOccupied={isPortOccupied}
          validationErrors={{
            device: validationErrors.device1,
            portOrCard: validationErrors.portOrCard1
          }}
        />

        <DeviceSelector 
          title="Drugie urządzenie"
          devices={devices}
          selectedDevice={device2}
          onDeviceChange={setDevice2}
          connectionType={connectionType}
          selectedPortOrCard={portOrCard2}
          onPortOrCardChange={setPortOrCard2}
          allPorts={allPorts2}
          availableCards={availableCards2}
          isPortOccupied={isPortOccupied}
          validationErrors={{
            device: validationErrors.device2,
            portOrCard: validationErrors.portOrCard2
          }}
          excludeDeviceId={device1 as number}
        />

        <ConnectionInfo 
          device1={device1Obj}
          device2={device2Obj}
          connectionType={connectionType}
          availablePorts1={availablePorts1}
          availablePorts2={availablePorts2}
          availableCards1={availableCards1}
          availableCards2={availableCards2}
          areDevicesConnected={areDevicesConnected}
        />

        <Button type="submit" disabled={operationLoading}>
          {operationLoading ? 'Dodawanie...' : 'Dodaj połączenie'}
        </Button>
      </DeviceForm>

      <ConnectionsList 
        allConnections={allConnections}
        filteredConnections={filteredConnections}
        panelTab={panelTab}
        onTabChange={setPanelTab}
        onShowInfo={handleShowInfo}
        onRemoveConnection={handleRemoveConnection}
      />

      <ConnectionInfoModal 
        isOpen={showInfoPanel}
        connection={selectedConnection}
        onClose={handleCloseInfo}
      />
    </MainContainer>
  );
};

export default ConnectionManagerPage;
