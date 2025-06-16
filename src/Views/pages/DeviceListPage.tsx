import { useEffect, useState } from 'react';
import { fetchDevicesRequest } from '../../Update/Slices/devicesSlice';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background: #f7fafd;
`;

const ListPanel = styled.div`
  width: 540px;
  border-right: 2px solid #1976d2;
  background: #fff;
  padding: 28px 18px 18px 18px;
  overflow-y: auto;
`;

const DeviceItem = styled.div<{ selected?: boolean }>`
  border: 2px solid ${({ selected }) => (selected ? '#1976d2' : '#e3e3e3')};
  border-radius: 12px;
  margin-bottom: 18px;
  padding: 14px 16px;
  background: ${({ selected }) => (selected ? '#e3f2fd' : '#fafcff')};
  cursor: pointer;
  box-shadow: ${({ selected }) => (selected ? '0 2px 8px #1976d2aa' : '0 1px 4px #0001')};
  transition: border 0.2s, background 0.2s;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
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
  white-space: nowrap; /* zapobiega łamaniu tekstu */
  max-width: 180px; /* opcjonalnie ogranicz szerokość */
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DetailsPanel = styled.div`
  flex: 1;
  padding: 36px 32px 32px 32px;
  background: #f7fafd;
  overflow-y: auto;
`;

const DetailsTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 12px;
`;

const DetailsSection = styled.div`
  margin-bottom: 18px;
`;

const DetailsLabel = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
`;

const DetailsValue = styled.div`
  color: #444;
  font-size: 15px;
  margin-bottom: 2px;
`;

const DeviceListPage = () => {
  const dispatch = useDispatch();
  const devices = useSelector((state: RootState) => state.devices.devices);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  useEffect(() => {
    if (!devices || devices.length === 0) {
      dispatch(fetchDevicesRequest());
    }
  }, [devices, dispatch]);

  // Typy urządzeń do zakładek
  const deviceTypes = Array.from(new Set(devices.map(d => d.typ?.typ_u).filter(Boolean)));
  const filteredDevices = selectedType === 'all'
    ? devices
    : devices.filter(d => d.typ?.typ_u === selectedType);
  const selectedDevice = devices.find(d => d.urzadzenie.id_u === selectedDeviceId);

  return (
    <PageContainer>
      <ListPanel>
        <h2 style={{ color: '#1976d2', marginBottom: 18 }}>Lista urządzeń</h2>
        <Tabs>
          <TabButton active={selectedType === 'all'} onClick={() => setSelectedType('all')}>Wszystkie</TabButton>
          {deviceTypes.map(type => (
            <TabButton key={type} active={selectedType === type} onClick={() => setSelectedType(type)}>
              {type}
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
                      <b>{port.nazwa}</b> (Status: {port.status})
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
                      <b>{card.nazwa}</b> (Status: {card.status})
                      <br />
                      <small>
                        Pasma: 2.4GHz: {card.pasmo?.pasmo24GHz ? 'Tak' : 'Nie'}, 5GHz: {card.pasmo?.pasmo5GHz ? 'Tak' : 'Nie'}
                        <br />
                        WiFi: 4: {card.wersja?.WIFI4 ? 'Tak' : 'Nie'}, 5: {card.wersja?.WIFI5 ? 'Tak' : 'Nie'}, 6: {card.wersja?.WIFI6 ? 'Tak' : 'Nie'}
                        <br />
                        Prędkości: 200Mb: {card.predkosc?.["200Mb"] ? 'Tak' : 'Nie'}, 800Mb: {card.predkosc?.["800Mb"] ? 'Tak' : 'Nie'}, 2Gb: {card.predkosc?.["2Gb"] ? 'Tak' : 'Nie'}
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