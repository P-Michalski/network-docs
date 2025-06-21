import { DetailsTitle, DetailsSection, DetailsLabel, DetailsValue, DetailsList, DetailsListItem, ItemName, ItemDetails } from './styled';

interface DeviceDetailsProps {
  device: any;
}

export const DeviceDetails = ({ device }: DeviceDetailsProps) => {
  return (
    <>
      <DetailsTitle>{device.urzadzenie.nazwa_urzadzenia}</DetailsTitle>
      <DetailsSection>
        <DetailsLabel>Typ:</DetailsLabel>
        <DetailsValue>{device.typ?.typ_u}</DetailsValue>
      </DetailsSection>
      <DetailsSection>
        <DetailsLabel>Lokalizacja:</DetailsLabel>
        <DetailsValue>
          Miejsce: {device.lokalizacja?.miejsce || 'Brak danych'}
        </DetailsValue>
        <DetailsValue>
          Szafa: {device.lokalizacja?.szafa || 'Brak danych'}
        </DetailsValue>
        <DetailsValue>
          Rack: {device.lokalizacja?.rack || 'Brak danych'}
        </DetailsValue>
      </DetailsSection>
      <DetailsSection>
        <DetailsLabel>MAC:</DetailsLabel>
        <DetailsValue>{device.mac?.MAC || 'Brak danych'}</DetailsValue>
      </DetailsSection>      <DetailsSection>
        <DetailsLabel>Porty:</DetailsLabel>
        {device.porty && device.porty.length > 0 ? (
          <DetailsList>
            {device.porty.map((port: any) => (
              <DetailsListItem key={port.id_p}>
                <ItemName>{port.nazwa}</ItemName>
                <br />
                <ItemDetails>
                  Status: {port.status} {port.status == "aktywny" ? (port.polaczenia_portu?.length > 0 ? "(połączony)" : "(niepołączony)") : ""}
                  <br />
                  Typ: {port.typ || 'Brak danych'}
                  <br />
                  Prędkość: {port.predkosc_portu?.predkosc || 'Brak danych'}
                </ItemDetails>
              </DetailsListItem>
            ))}
          </DetailsList>
        ) : (
          <DetailsValue>Brak portów</DetailsValue>
        )}
      </DetailsSection>      <DetailsSection>
        <DetailsLabel>Karty WiFi:</DetailsLabel>
        {device.karty_wifi && device.karty_wifi.length > 0 ? (
          <DetailsList>
            {device.karty_wifi.map((card: any) => (
              <DetailsListItem key={card.id_k}>
                <ItemName>{card.nazwa}</ItemName>
                <br />
                <ItemDetails>
                  Status: {card.status}
                  <br />
                  Pasma: 2.4GHz: {card.pasmo?.pasmo24GHz ? 'Tak' : 'Nie'}, 5GHz: {card.pasmo?.pasmo5GHz ? 'Tak' : 'Nie'}, 6GHz: {card.pasmo?.pasmo6GHz ? 'Tak' : 'Nie'}
                  <br />
                  Wersja WiFi: {card.wersja?.wersja || 'Brak danych'}
                  <br />
                  Prędkość: {card.predkosc?.predkosc ? `${card.predkosc.predkosc}Mb/s` : 'Brak danych'}
                  <br />
                  Połączenia: {card.polaczenia_karty?.length || 0}
                </ItemDetails>
              </DetailsListItem>
            ))}
          </DetailsList>
        ) : (
          <DetailsValue>Brak kart WiFi</DetailsValue>
        )}
      </DetailsSection>
    </>
  );
};
