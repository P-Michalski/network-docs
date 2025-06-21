import {
  InfoPanelOverlay,
  InfoPanel,
  InfoPanelHeader,
  InfoPanelTitle,
  InfoPanelCloseButton,
  InfoPanelContent,
  InfoRow,
  InfoLabel,
  InfoValue,
  InfoSection,
  InfoSectionTitle
} from '../styled';

interface Connection {
  type: 'port' | 'wifi';
  device1: string;
  device2: string;
  port1?: string;
  port2?: string;
  card1?: string;
  card2?: string;
  max_predkosc?: string;
  pasmo?: string;
}

interface ConnectionInfoModalProps {
  isOpen: boolean;
  connection: Connection | null;
  onClose: () => void;
}

export const ConnectionInfoModal = ({ 
  isOpen, 
  connection, 
  onClose 
}: ConnectionInfoModalProps) => {
  if (!isOpen || !connection) return null;

  return (
    <InfoPanelOverlay onClick={onClose}>
      <InfoPanel onClick={(e) => e.stopPropagation()}>
        <InfoPanelHeader>
          <InfoPanelTitle>
            Szczegóły połączenia
          </InfoPanelTitle>
          <InfoPanelCloseButton onClick={onClose}>
            ×
          </InfoPanelCloseButton>
        </InfoPanelHeader>            

        <InfoPanelContent>
          <InfoSection>
            <InfoSectionTitle>Urządzenia i komponenty</InfoSectionTitle>
            <InfoRow>
              <InfoLabel>Urządzenie 1:</InfoLabel>
              <InfoValue>{connection.device1}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>{connection.type === 'port' ? 'Port 1:' : 'Karta WiFi 1:'}</InfoLabel>
              <InfoValue>{connection.type === 'port' ? connection.port1 : connection.card1}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Urządzenie 2:</InfoLabel>
              <InfoValue>{connection.device2}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>{connection.type === 'port' ? 'Port 2:' : 'Karta WiFi 2:'}</InfoLabel>
              <InfoValue>{connection.type === 'port' ? connection.port2 : connection.card2}</InfoValue>
            </InfoRow>
          </InfoSection>

          <InfoSection>
            <InfoSectionTitle>Parametry połączenia</InfoSectionTitle>
            <InfoRow>
              <InfoLabel>Typ połączenia:</InfoLabel>
              <InfoValue>{connection.type === 'port' ? 'Port' : 'WiFi'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Maksymalna prędkość:</InfoLabel>
              <InfoValue>{connection.max_predkosc || 'Brak danych'}</InfoValue>
            </InfoRow>
            {connection.type === 'wifi' && (
              <InfoRow>
                <InfoLabel>Pasmo:</InfoLabel>
                <InfoValue>{connection.pasmo || 'Brak danych'}</InfoValue>
              </InfoRow>
            )}
          </InfoSection>
        </InfoPanelContent>
      </InfoPanel>
    </InfoPanelOverlay>
  );
};
