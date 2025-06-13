import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { MainContainer, DeviceForm, Fieldset, Legend, FormField, Label, Select, Button } from '../components/DeviceForm/StyledFormComponents';
import { WideSidePanel, WideSidePanelHeader, WideSidePanelList, RemoveConnectionButton } from '../components/ConnectionForm/StyledConnectionFormComponents';
import styled from 'styled-components';
import { fetchDevicesRequest } from '../../Update/Slices/devicesSlice';

const TabBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;
const TabButton = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? '#1976d2' : '#e3f2fd')};
  color: ${({ active }) => (active ? '#fff' : '#1976d2')};
  border: none;
  border-radius: 4px 4px 0 0;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #1565c0;
    color: #fff;
  }
`;

const ConnectionManagerPage = () => {
  const dispatch = useDispatch();
  const devices = useSelector((state: RootState) => state.devices.devices);
  const [connectionType, setConnectionType] = useState<'port' | 'wifi'>('port');
  const [device1, setDevice1] = useState<number | ''>('');
  const [device2, setDevice2] = useState<number | ''>('');
  const [portOrCard1, setPortOrCard1] = useState<number | ''>('');
  const [portOrCard2, setPortOrCard2] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [panelTab, setPanelTab] = useState<'port' | 'wifi' | 'all'>('all');

  // Dynamic lists
  const device1Obj = useMemo(() => devices.find(d => d.urzadzenie.id_u === device1), [devices, device1]);
  const device2Obj = useMemo(() => devices.find(d => d.urzadzenie.id_u === device2), [devices, device2]);
  const portList1 = connectionType === 'port' ? (device1Obj?.porty || []) : (device1Obj?.karty_wifi || []);
  const portList2 = connectionType === 'port' ? (device2Obj?.porty || []) : (device2Obj?.karty_wifi || []);

  // --- WALIDACJA DOSTĘPNYCH KART WIFI ---
  // Dla kart WiFi: nie pokazuj kart już połączonych z wybraną kartą (unikalność pary)
  const getAvailableCards = (cards: any[], selectedCardId: number | '') => {
    if (!selectedCardId) return cards;
    // Zbierz id_k wszystkich kart już połączonych z wybraną kartą
    const connectedIds = new Set<number>();
    const selectedCard = cards.find(c => c.id_k === selectedCardId);
    selectedCard?.polaczenia_karty?.forEach((conn: any) => {
      if (conn.id_k_1 && conn.id_k_1 !== selectedCardId) connectedIds.add(conn.id_k_1);
      if (conn.id_k_2 && conn.id_k_2 !== selectedCardId) connectedIds.add(conn.id_k_2);
    });
    // Dodatkowo: nie pozwól na połączenie z samą sobą
    return cards.filter(c => c.id_k !== selectedCardId && !connectedIds.has(c.id_k));
  };

  // --- WALIDACJA DOSTĘPNYCH PORTÓW ---
  // (już jest: tylko porty bez połączeń)

  // --- WALIDACJA: czy połączenie kart już istnieje? ---
  const wifiConnectionExists = (id_k_1: number, id_k_2: number) => {
    const ids = [id_k_1, id_k_2].sort((a, b) => a - b);
    return allWifiConnections.some(conn => {
      const cids = [conn.id_k_1, conn.id_k_2].sort((a: number, b: number) => a - b);
      return cids[0] === ids[0] && cids[1] === ids[1];
    });
  };

  // --- DODAWANIE POŁĄCZENIA ---
  const getMaxWifiSpeed = (card1: any, card2: any) => {
    // Zwróć największą prędkość obsługiwaną przez obie karty
    const speeds = ['2Gb', '800Mb', '200Mb'];
    for (const s of speeds) {
      if (card1.predkosc?.[s] && card2.predkosc?.[s]) return s;
    }
    return 'brak';
  };
  const getCommonBand = (card1: any, card2: any) => {
    // Zwróć tylko jedno wspólne pasmo (priorytet: 5GHz, potem 2.4GHz)
    if (card1.pasmo?.pasmo5GHz && card2.pasmo?.pasmo5GHz) return '5GHz';
    if (card1.pasmo?.pasmo24GHz && card2.pasmo?.pasmo24GHz) return '2.4GHz';
    return 'brak';
  };
  const getMaxPortSpeed = (port1: any, port2: any) => {
    // If ports have predkosc, use the minimum of both; fallback to 'brak'
    const speeds = ['2Gb', '800Mb', '200Mb'];
    for (const s of speeds) {
      if (port1.predkosc?.[s] && port2.predkosc?.[s]) return s;
    }
    return 'brak';
  };

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!device1 || !device2 || !portOrCard1 || !portOrCard2) return;
    if (device1 === device2 && portOrCard1 === portOrCard2) return;
    setLoading(true);
    try {
      if (connectionType === 'port') {
        const port1 = device1Obj?.porty?.find((p: any) => p.id_p === portOrCard1);
        const port2 = device2Obj?.porty?.find((p: any) => p.id_p === portOrCard2);
        if (!port1 || !port2) throw new Error('Nie znaleziono portów');
        if ((port1.polaczenia_portu && port1.polaczenia_portu.length > 0) || (port2.polaczenia_portu && port2.polaczenia_portu.length > 0)) {
          setError('Jeden z portów jest już połączony.');
          setLoading(false);
          return;
        }
        // Wyznacz max_predkosc
        const max_predkosc = getMaxPortSpeed(port1, port2);
        dispatch({
          type: 'devices/addConnectionRequest',
          payload: {
            connectionType: 'port',
            payload: { id_p_1: portOrCard1, id_p_2: portOrCard2, max_predkosc }
          }
        });
        setSuccess('Połączenie portów dodane!');
      } else {
        if (wifiConnectionExists(portOrCard1 as number, portOrCard2 as number)) {
          setError('To połączenie kart już istnieje.');
          setLoading(false);
          return;
        }
        if (portOrCard1 === portOrCard2) {
          setError('Nie można połączyć karty z samą sobą.');
          setLoading(false);
          return;
        }
        // Znajdź obie karty
        const card1 = devices.flatMap(d => d.karty_wifi).find((k: any) => k.id_k === portOrCard1);
        const card2 = devices.flatMap(d => d.karty_wifi).find((k: any) => k.id_k === portOrCard2);
        if (!card1 || !card2) throw new Error('Nie znaleziono kart WiFi');
        const max_predkosc = getMaxWifiSpeed(card1, card2);
        const pasmo = getCommonBand(card1, card2);
        if (pasmo === 'brak') {
          setError('Nie można połączyć kart WiFi bez wspólnego pasma.');
          setLoading(false);
          return;
        }
        dispatch({
          type: 'devices/addConnectionRequest',
          payload: {
            connectionType: 'wifi',
            payload: { id_k_1: portOrCard1, id_k_2: portOrCard2, max_predkosc, pasmo }
          }
        });
        setSuccess('Połączenie kart WiFi dodane!');
      }
      setPortOrCard1('');
      setPortOrCard2('');
      setDevice1('');
      setDevice2('');
      dispatch(fetchDevicesRequest());
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Błąd dodawania połączenia');
    } finally {
      setLoading(false);
    }
  };

  // --- USUWANIE POŁĄCZENIA ---
  const handleRemoveConnection = async (conn: any) => {
    setError(null); setSuccess(null); setLoading(true);
    try {
      if (conn.type === 'port') {
        dispatch({
          type: 'devices/deleteConnectionRequest',
          payload: {
            connectionType: 'port',
            payload: { id_p_1: conn.id_p_1, id_p_2: conn.id_p_2 }
          }
        });
        setSuccess('Połączenie portów usunięte!');
      } else {
        dispatch({
          type: 'devices/deleteConnectionRequest',
          payload: {
            connectionType: 'wifi',
            payload: { id_k_1: conn.id_k_1, id_k_2: conn.id_k_2 }
          }
        });
        setSuccess('Połączenie kart WiFi usunięte!');
      }
      dispatch(fetchDevicesRequest());
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Błąd usuwania połączenia');
    } finally {
      setLoading(false);
    }
  };
  // --- SELECTY: porty/karty ---
  // Porty: tylko aktywne porty można wybrać, nieaktywne są wyszarzone i disabled
  const availablePorts1 = connectionType === 'port'
    ? portList1.filter((p: any) => (!p.polaczenia_portu || p.polaczenia_portu.length === 0))
    : portList1;
  const availablePorts2 = connectionType === 'port'
    ? portList2.filter((p: any) => (!p.polaczenia_portu || p.polaczenia_portu.length === 0))
    : getAvailableCards(portList2, portOrCard1);

  // --- ZBIERANIE POŁĄCZEŃ DO PANELU BOCZNEGO ---
  // Port connections: unique, bidirectional, skip self-connections
  const allPortConnections = useMemo(() => {
    const seen = new Set<string>();
    const result: any[] = [];
    // Gather all ports with their device
    const allPorts: { port: any, device: any }[] = devices.flatMap(dev => (dev.porty || []).map((port: any) => ({ port, device: dev })));
    allPorts.forEach(({ port }) => {
      port.polaczenia_portu?.forEach((conn: any) => {
        const ids = [port.id_p, conn.id_p_2].sort((a, b) => a - b);
        if (ids[0] === ids[1]) return;
        const key = `${ids[0]}-${ids[1]}`;
        if (!seen.has(key)) {
          // Find both ports and their devices
          const port1Obj = allPorts.find(p => p.port.id_p === ids[0]);
          const port2Obj = allPorts.find(p => p.port.id_p === ids[1]);
          result.push({
            type: 'port',
            id_p_1: ids[0],
            id_p_2: ids[1],
            dev1Name: port1Obj?.device.urzadzenie.nazwa_urzadzenia,
            dev2Name: port2Obj?.device.urzadzenie.nazwa_urzadzenia,
            port1Name: port1Obj?.port.nazwa,
            port2Name: port2Obj?.port.nazwa,
            id_u_1: port1Obj?.device.urzadzenie.id_u,
            id_u_2: port2Obj?.device.urzadzenie.id_u,
          });
          seen.add(key);
        }
      });
    });
    return result;
  }, [devices]);

  // WiFi connections: unique pairs, bidirectional
  const allWifiConnections = useMemo(() => {
    const seen = new Set<string>();
    const result: any[] = [];
    devices.forEach(dev => {
      dev.karty_wifi?.forEach((card: any) => {
        card.polaczenia_karty?.forEach((conn: any) => {
          const ids = [conn.id_k_1, conn.id_k_2].sort((a, b) => a - b);
          const key = `${ids[0]}-${ids[1]}`;
          if (!seen.has(key)) {
            // Find both cards and their devices
            const card1 = devices.flatMap(d => d.karty_wifi).find((k: any) => k.id_k === ids[0]);
            const card2 = devices.flatMap(d => d.karty_wifi).find((k: any) => k.id_k === ids[1]);
            const dev1 = devices.find(d => d.karty_wifi.some((k: any) => k.id_k === ids[0]));
            const dev2 = devices.find(d => d.karty_wifi.some((k: any) => k.id_k === ids[1]));
            result.push({
              type: 'wifi',
              id_k_1: ids[0],
              id_k_2: ids[1],
              dev1Name: dev1?.urzadzenie.nazwa_urzadzenia,
              dev2Name: dev2?.urzadzenie.nazwa_urzadzenia,
              card1Name: card1?.nazwa,
              card2Name: card2?.nazwa,
              id_u_1: dev1?.urzadzenie.id_u,
              id_u_2: dev2?.urzadzenie.id_u,
            });
            seen.add(key);
          }
        });
      });
    });
    return result;
  }, [devices]);

  const allConnections = useMemo(() => [
    ...allPortConnections,
    ...allWifiConnections,
  ], [allPortConnections, allWifiConnections]);

  // --- FETCH DEVICES ON MOUNT ---
  useEffect(() => {
    dispatch(fetchDevicesRequest());
  }, [dispatch]);

  // --- UI ---
  return (
    <MainContainer>
      <DeviceForm onSubmit={handleAddConnection}>
        <Fieldset>
          <Legend>Nowe połączenie</Legend>
          {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
          {success && <div style={{color: 'green', marginBottom: 8}}>{success}</div>}
          <FormField>
            <Label>Typ połączenia:</Label>
            <Select value={connectionType} onChange={e => {
              setConnectionType(e.target.value as 'port' | 'wifi');
              setPortOrCard1('');
              setPortOrCard2('');
              setDevice1('');
              setDevice2('');
            }} disabled={loading}>
              <option value="port">Porty</option>
              <option value="wifi">Karty WiFi</option>
            </Select>
          </FormField>
          <FormField>
            <Label>Urządzenie 1:</Label>
            <Select value={device1} onChange={e => {
              setDevice1(Number(e.target.value));
              setPortOrCard1('');
            }} disabled={loading}>
              <option value="">Wybierz...</option>
              {devices.map(d => (
                <option key={d.urzadzenie.id_u} value={d.urzadzenie.id_u} disabled={d.urzadzenie.id_u === device2}>
                  {d.urzadzenie.nazwa_urzadzenia}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label>{connectionType === 'port' ? 'Port' : 'Karta WiFi'} 1:</Label>
            <Select value={portOrCard1} onChange={e => setPortOrCard1(Number(e.target.value))} disabled={loading || !device1}>
              <option value="">Wybierz...</option>
              {availablePorts1.map((p: any) => (
                <option
                  key={connectionType === 'port' ? p.id_p : p.id_k}
                  value={connectionType === 'port' ? p.id_p : p.id_k}
                  disabled={connectionType === 'port'
                    ? p.status !== 'aktywny'
                    : p.status !== 'aktywny'}
                  style={p.status !== 'aktywny' ? { color: '#aaa', fontStyle: 'italic' } : {}}
                >
                  {connectionType === 'port'
                    ? `${p.nazwa}${p.status !== 'aktywny' ? ' (nieaktywny)' : ''}`
                    : `${p.nazwa}${p.status !== 'aktywny' ? ' (nieaktywna)' : ''}`}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label>Urządzenie 2:</Label>
            <Select value={device2} onChange={e => {
              setDevice2(Number(e.target.value));
              setPortOrCard2('');
            }} disabled={loading}>
              <option value="">Wybierz...</option>
              {devices.map(d => (
                <option key={d.urzadzenie.id_u} value={d.urzadzenie.id_u} disabled={d.urzadzenie.id_u === device1}>
                  {d.urzadzenie.nazwa_urzadzenia}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label>{connectionType === 'port' ? 'Port' : 'Karta WiFi'} 2:</Label>
            <Select value={portOrCard2} onChange={e => setPortOrCard2(Number(e.target.value))} disabled={loading || !device2}>
              <option value="">Wybierz...</option>
              {availablePorts2.map((p: any) => (
                <option
                  key={connectionType === 'port' ? p.id_p : p.id_k}
                  value={connectionType === 'port' ? p.id_p : p.id_k}
                  disabled={connectionType === 'port'
                    ? p.status !== 'aktywny'
                    : p.status !== 'aktywny'}
                  style={p.status !== 'aktywny' ? { color: '#aaa', fontStyle: 'italic' } : {}}
                >
                  {connectionType === 'port'
                    ? `${p.nazwa}${p.status !== 'aktywny' ? ' (nieaktywny)' : ''}`
                    : `${p.nazwa}${p.status !== 'aktywny' ? ' (nieaktywna)' : ''}`}
                </option>
              ))}
            </Select>
          </FormField>
          <Button type="submit" disabled={loading}>AddConnection</Button>
        </Fieldset>
      </DeviceForm>
      <WideSidePanel>
        <WideSidePanelHeader>Połączenia</WideSidePanelHeader>
        <TabBar>
          <TabButton active={panelTab === 'port'} onClick={() => setPanelTab('port')}>Porty</TabButton>
          <TabButton active={panelTab === 'wifi'} onClick={() => setPanelTab('wifi')}>Karty WiFi</TabButton>
          <TabButton active={panelTab === 'all'} onClick={() => setPanelTab('all')}>Wszystkie</TabButton>
        </TabBar>
        <WideSidePanelList>
          {(panelTab === 'port' ? allPortConnections : panelTab === 'wifi' ? allWifiConnections : allConnections).map((conn, idx) => (
            <li key={idx}>
              {conn.type === 'port'
                ? `Port "${conn.port1Name ?? conn.id_p_1 + ' (nie znaleziono)'}" (${conn.dev1Name ?? conn.id_u_1 + ' (nie znaleziono)'}) ↔ Port "${conn.port2Name ?? conn.id_p_2 + ' (nie znaleziono)'}" (${conn.dev2Name ?? conn.id_u_2 + ' (nie znaleziono)'})`
                : `Karta "${conn.card1Name ?? conn.id_k_1 + ' (nie znaleziono)'}" (${conn.dev1Name ?? conn.id_u_1 + ' (nie znaleziono)'}) ↔ Karta "${conn.card2Name ?? conn.id_k_2 + ' (nie znaleziono)'}" (${conn.dev2Name ?? conn.id_u_2 + ' (nie znaleziono)'})`}
              <RemoveConnectionButton type="button" onClick={() => handleRemoveConnection(conn)} disabled={loading}>
                Usuń
              </RemoveConnectionButton>
            </li>
          ))}
        </WideSidePanelList>
      </WideSidePanel>
    </MainContainer>
  );
};

export default ConnectionManagerPage;