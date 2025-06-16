import { useState } from 'react';
import { useDevices } from '../../hooks/useDevices';
import { useDeviceFiltering } from '../../hooks/useDeviceFiltering';
import { PageContainer, ListPanel, DeviceItem, Tabs, TabButton, DetailsPanel, DetailsLabel, DetailsSection, DetailsTitle, DetailsValue} from '../components/DeviceListPage/StyledDeviceListPageComponents';

const DeviceListPage = () => {
  const { devices } = useDevices();
  const { activeTab, setActiveTab, deviceTypes, filteredDevices, getTabLabel } = useDeviceFiltering(devices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  
  const selectedDevice = devices.find(d => d.urzadzenie.id_u === selectedDeviceId);
  return (
    <PageContainer>
      <ListPanel>
        <h2 style={{ color: '#1976d2', marginBottom: 18 }}>Lista urządzeń</h2>
        <Tabs>
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
            {getTabLabel('all')}
          </TabButton>
          {deviceTypes.map(type => (
            <TabButton key={type} active={activeTab === type} onClick={() => setActiveTab(type)}>
              {getTabLabel(type)}
            </TabButton>
          ))}
        </Tabs>
        {filteredDevices.map(device => (
          <DeviceItem
            key={device.urzadzenie.id_u}
            selected={selectedDeviceId === device.urzadzenie.id_u}
            onClick={() => setSelectedDeviceId(device.urzadzenie.id_u ?? 0)}
          >
            <span style={{ fontWeight: 600 }}>{device.urzadzenie.nazwa_urzadzenia}</span>
            <span style={{ color: '#888', fontSize: 14 }}>({device.typ?.typ_u})</span>
          </DeviceItem>
        ))}
      </ListPanel>
      <DetailsPanel>
        {selectedDevice ? (
          <>
            <DetailsTitle>{selectedDevice.urzadzenie.nazwa_urzadzenia}</DetailsTitle>
            <DetailsSection>
              <DetailsLabel>Typ:</DetailsLabel>
              <DetailsValue>{selectedDevice.typ?.typ_u}</DetailsValue>
            </DetailsSection>            <DetailsSection>
              <DetailsLabel>Lokalizacja:</DetailsLabel>
              <DetailsValue>
                Miejsce: {selectedDevice.lokalizacja?.miejsce || 'Brak danych'}
              </DetailsValue>
              <DetailsValue>
                Szafa: {selectedDevice.lokalizacja?.szafa || 'Brak danych'}
              </DetailsValue>
              <DetailsValue>
                Rack: {selectedDevice.lokalizacja?.rack || 'Brak danych'}
              </DetailsValue>
            </DetailsSection>
            <DetailsSection>
              <DetailsLabel>MAC:</DetailsLabel>
              <DetailsValue>{selectedDevice.mac?.MAC || 'Brak danych'}</DetailsValue>
            </DetailsSection>            <DetailsSection>
              <DetailsLabel>Porty:</DetailsLabel>
              {selectedDevice.porty && selectedDevice.porty.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {selectedDevice.porty.map(port => (
                    <li key={port.id_p}>
                      <b>{port.nazwa}</b>
                      <br />
                      <small>
                        Status: {port.status}
                        <br />
                        Typ: {port.typ || 'Brak danych'}
                        <br />
                        Prędkość: {port.predkosc_portu?.predkosc || 'Brak danych'}
                        <br />
                        Połączenia: {port.polaczenia_portu?.length || 0}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <DetailsValue>Brak portów</DetailsValue>
              )}
            </DetailsSection>            <DetailsSection>
              <DetailsLabel>Karty WiFi:</DetailsLabel>
              {selectedDevice.karty_wifi && selectedDevice.karty_wifi.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {selectedDevice.karty_wifi.map(card => (
                    <li key={card.id_k}>
                      <b>{card.nazwa}</b>
                      <br />
                      <small>
                        Status: {card.status}
                        <br />
                        Pasma: 2.4GHz: {card.pasmo?.pasmo24GHz ? 'Tak' : 'Nie'}, 5GHz: {card.pasmo?.pasmo5GHz ? 'Tak' : 'Nie'}, 6GHz: {card.pasmo?.pasmo6GHz ? 'Tak' : 'Nie'}
                        <br />
                        Wersja WiFi: {card.wersja?.wersja || 'Brak danych'}
                        <br />
                        Prędkość: {card.predkosc?.predkosc ? `${card.predkosc.predkosc}Mb/s` : 'Brak danych'}
                        <br />
                        Połączenia: {card.polaczenia_karty?.length || 0}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <DetailsValue>Brak kart WiFi</DetailsValue>
              )}
            </DetailsSection>
          </>
        ) : (
          <div style={{ color: '#888', fontSize: 18, marginTop: 40 }}>Wybierz urządzenie z listy, aby zobaczyć szczegóły.</div>
        )}
      </DetailsPanel>
    </PageContainer>
  );
};

export default DeviceListPage;