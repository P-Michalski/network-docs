import { MainContainer, DeviceForm, Fieldset, Legend, FormField, Label, Select, Button } from '../components/DeviceForm/StyledFormComponents';
import { WideSidePanel, WideSidePanelHeader, WideSidePanelList, RemoveConnectionButton, WideSidePanelListItem, TabBar, TabButton, ErrorMsg, InfoButton, InfoPanelOverlay, InfoPanel, InfoPanelHeader, InfoPanelTitle, InfoPanelCloseButton, InfoPanelContent, InfoRow, InfoLabel, InfoValue, InfoSection, InfoSectionTitle } from '../components/ConnectionForm/StyledConnectionFormComponents';
import { useConnectionManager } from '../../hooks/useConnectionManager';

const ConnectionManagerPage = () => {  const {
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
    
    // Loading states
    connectionsLoading,
    connectionsError,
    
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
  } = useConnectionManager();return (
    <MainContainer>      
      <DeviceForm onSubmit={handleAddConnection}>
        <h2>Nowe połączenie</h2>
          {/* Błąd ogólny */}
          {validationErrors.general && (
            <div style={{ marginBottom: '16px' }}>
              <ErrorMsg>{validationErrors.general}</ErrorMsg>
            </div>
          )}

          <Fieldset>
            <Legend>Typ połączenia</Legend>
            <FormField>
              <Label>
                <input                  
                  type="radio"
                  value="port"
                  checked={connectionType === 'port'}
                  onChange={(e) => setConnectionType(e.target.value as 'port' | 'wifi')}
                />
                Port
              </Label>
              <Label>
                <input                  
                  type="radio"
                  value="wifi"
                  checked={connectionType === 'wifi'}
                  onChange={(e) => setConnectionType(e.target.value as 'port' | 'wifi')}
                />
                WiFi
              </Label>
            </FormField>
          </Fieldset>

          <Fieldset>
            <Legend>Pierwsze urządzenie</Legend>
            <FormField>              <Select 
                value={device1} 
                onChange={(e) => setDevice1(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Wybierz urządzenie...</option>
                {devices.map(device => (
                  <option key={device.urzadzenie.id_u} value={device.urzadzenie.id_u}>
                    {device.urzadzenie.nazwa_urzadzenia}
                  </option>
                ))}
              </Select>
              {validationErrors.device1 && <ErrorMsg>{validationErrors.device1}</ErrorMsg>}
            </FormField>
              
            {device1 && (
              <FormField>
                <Select value={portOrCard1} onChange={(e) => setPortOrCard1(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">
                    {connectionType === 'port' ? 'Wybierz port...' : 'Wybierz kartę WiFi...'}
                  </option>
                  {connectionType === 'port' 
                    ? allPorts1.map(port => {
                        const isOccupied = isPortOccupied(port.id_p, device1 as number);
                        const isInactive = port.status !== 'aktywny';
                        const isDisabled = isOccupied || isInactive;
                        
                        return (
                          <option 
                            key={port.id_p} 
                            value={port.id_p}
                            disabled={isDisabled}
                            style={{ 
                              color: isDisabled ? '#999' : 'inherit',
                              fontStyle: isDisabled ? 'italic' : 'normal'
                            }}
                          >
                            {port.nazwa} ({port.typ})
                            {isOccupied && ' - zajęty'}
                            {isInactive && ' - nieaktywny'}
                          </option>
                        );                      
                      })                    
                    : availableCards1.map(card => (
                        <option key={card.id_k} value={card.id_k}>
                          {card.nazwa}
                        </option>
                      ))
                  }
                </Select>
                {validationErrors.portOrCard1 && <ErrorMsg>{validationErrors.portOrCard1}</ErrorMsg>}
              </FormField>
            )}
          </Fieldset>

          <Fieldset>
            <Legend>Drugie urządzenie</Legend>
            <FormField>                <Select value={device2} onChange={(e) => setDevice2(e.target.value ? Number(e.target.value) : '')}>
                <option value="">Wybierz urządzenie...</option>
                {devices
                  .filter(device => device.urzadzenie.id_u !== device1)
                  .map(device => (
                    <option key={device.urzadzenie.id_u} value={device.urzadzenie.id_u}>
                      {device.urzadzenie.nazwa_urzadzenia}
                    </option>
                  ))
                }
              </Select>
              {validationErrors.device2 && <ErrorMsg>{validationErrors.device2}</ErrorMsg>}
            </FormField>
            
            {device2 && (
              <FormField>                
                <Select value={portOrCard2} onChange={(e) => setPortOrCard2(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">
                    {connectionType === 'port' ? 'Wybierz port...' : 'Wybierz kartę WiFi...'}
                  </option>
                  {connectionType === 'port' 
                    ? allPorts2.map(port => {
                        const isOccupied = isPortOccupied(port.id_p, device2 as number);
                        const isInactive = port.status !== 'aktywny';
                        const isDisabled = isOccupied || isInactive;
                        
                        return (
                          <option 
                            key={port.id_p} 
                            value={port.id_p}
                            disabled={isDisabled}
                            style={{ 
                              color: isDisabled ? '#999' : 'inherit',
                              fontStyle: isDisabled ? 'italic' : 'normal'
                            }}
                          >
                            {port.nazwa} ({port.typ})
                            {isOccupied && ' - zajęty'}
                            {isInactive && ' - nieaktywny'}
                          </option>
                        );
                      })                    
                    : availableCards2.map(card => (
                        <option key={card.id_k} value={card.id_k}>
                          {card.nazwa}
                        </option>
                      ))
                  }
                </Select>
                {validationErrors.portOrCard2 && <ErrorMsg>{validationErrors.portOrCard2}</ErrorMsg>}
              </FormField>
            )}
          </Fieldset>

          {/* Informacje o dostępności */}
          {device1 && device2 && (
            <Fieldset>
              <Legend>Informacje</Legend>
              <FormField>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  {connectionType === 'port' ? (
                    <>
                      <div>Dostępne porty urządzenia "{device1Obj?.urzadzenie.nazwa_urzadzenia}": {availablePorts1.length}</div>
                      <div>Dostępne porty urządzenia "{device2Obj?.urzadzenie.nazwa_urzadzenia}": {availablePorts2.length}</div>
                      {areDevicesConnected(device1 as number, device2 as number, 'port') && (
                        <div style={{ color: '#ff9800', fontWeight: 'bold' }}>
                          ⚠️ Urządzenia są już połączone przez port
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>Dostępne karty WiFi urządzenia "{device1Obj?.urzadzenie.nazwa_urzadzenia}": {availableCards1.length}</div>
                      <div>Dostępne karty WiFi urządzenia "{device2Obj?.urzadzenie.nazwa_urzadzenia}": {availableCards2.length}</div>
                      {areDevicesConnected(device1 as number, device2 as number, 'wifi') && (
                        <div style={{ color: '#ff9800', fontWeight: 'bold' }}>
                          ⚠️ Urządzenia są już połączone przez WiFi
                        </div>
                      )}
                    </>
                  )}
                </div>
              </FormField>
            </Fieldset>          
          )}          

          <Button type="submit" disabled={connectionsLoading}>
            {connectionsLoading ? 'Dodawanie...' : 'Dodaj połączenie'}          
          </Button>
          
          {connectionsError && <ErrorMsg>{connectionsError}</ErrorMsg>}
          {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
      </DeviceForm>

      <WideSidePanel>
        <WideSidePanelHeader>Lista połączeń</WideSidePanelHeader>          <TabBar>
          <TabButton 
            active={panelTab === 'all'} 
            onClick={() => setPanelTab('all')}
          >
            Wszystkie ({allConnections.length})
          </TabButton>
          <TabButton 
            active={panelTab === 'port'} 
            onClick={() => setPanelTab('port')}
          >
            Porty ({allConnections.filter(c => c.type === 'port').length})
          </TabButton>
          <TabButton 
            active={panelTab === 'wifi'} 
            onClick={() => setPanelTab('wifi')}
          >
            WiFi ({allConnections.filter(c => c.type === 'wifi').length})
          </TabButton>
        </TabBar>

        <WideSidePanelList>          
          {filteredConnections.map((connection, index) => (
            <WideSidePanelListItem key={index}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <strong>{connection.device1}</strong>
                    <br />
                    <small>{connection.type === 'port' ? connection.port1 : connection.card1}</small>
                  </div>
                  <div style={{ fontSize: '18px', color: '#666' }}>↔</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <strong>{connection.device2}</strong>
                    <br />
                    <small>{connection.type === 'port' ? connection.port2 : connection.card2}</small>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
                  <InfoButton onClick={() => handleShowInfo(connection)}>
                    Info
                  </InfoButton>
                  <RemoveConnectionButton onClick={() => handleRemoveConnection(connection)}>
                    Usuń
                  </RemoveConnectionButton>
                </div>
              </div>
            </WideSidePanelListItem>
          ))}
          {filteredConnections.length === 0 && (
            <WideSidePanelListItem>
              <div>Brak połączeń do wyświetlenia</div>
            </WideSidePanelListItem>
          )}
        </WideSidePanelList>
      </WideSidePanel>

      {/* Info Panel */}
      {showInfoPanel && selectedConnection && (
        <InfoPanelOverlay onClick={handleCloseInfo}>
          <InfoPanel onClick={(e) => e.stopPropagation()}>
            <InfoPanelHeader>
              <InfoPanelTitle>
                Szczegóły połączenia
              </InfoPanelTitle>
              <InfoPanelCloseButton onClick={handleCloseInfo}>
                ×
              </InfoPanelCloseButton>
            </InfoPanelHeader>            

            <InfoPanelContent>
              <InfoSection>
                <InfoSectionTitle>Urządzenia i komponenty</InfoSectionTitle>
                <InfoRow>
                  <InfoLabel>Urządzenie 1:</InfoLabel>
                  <InfoValue>{selectedConnection.device1}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{selectedConnection.type === 'port' ? 'Port 1:' : 'Karta WiFi 1:'}</InfoLabel>
                  <InfoValue>{selectedConnection.type === 'port' ? selectedConnection.port1 : selectedConnection.card1}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Urządzenie 2:</InfoLabel>
                  <InfoValue>{selectedConnection.device2}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{selectedConnection.type === 'port' ? 'Port 2:' : 'Karta WiFi 2:'}</InfoLabel>
                  <InfoValue>{selectedConnection.type === 'port' ? selectedConnection.port2 : selectedConnection.card2}</InfoValue>
                </InfoRow>
              </InfoSection>

              <InfoSection>
                <InfoSectionTitle>Parametry połączenia</InfoSectionTitle>
                <InfoRow>
                  <InfoLabel>Typ połączenia:</InfoLabel>
                  <InfoValue>{selectedConnection.type === 'port' ? 'Port' : 'WiFi'}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Maksymalna prędkość:</InfoLabel>
                  <InfoValue>{selectedConnection.max_predkosc || 'Brak danych'}</InfoValue>
                </InfoRow>
                {selectedConnection.type === 'wifi' && (
                  <InfoRow>
                    <InfoLabel>Pasmo:</InfoLabel>
                    <InfoValue>{selectedConnection.pasmo || 'Brak danych'}</InfoValue>
                  </InfoRow>
                )}
              </InfoSection>
            </InfoPanelContent>
          </InfoPanel>
        </InfoPanelOverlay>
      )}
    </MainContainer>
  );
};

export default ConnectionManagerPage;
