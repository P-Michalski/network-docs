import {  InfoContainer, InfoItem, WarningText } from './styled';
import { Fieldset, Legend, FormField } from '../../styled';

interface ConnectionInfoProps {
  device1?: any;
  device2?: any;
  connectionType: 'port' | 'wifi';
  availablePorts1: any[];
  availablePorts2: any[];
  availableCards1: any[];
  availableCards2: any[];
  areDevicesConnected: (device1Id: number, device2Id: number, type: 'port' | 'wifi') => boolean;
}

export const ConnectionInfo = ({
  device1,
  device2,
  connectionType,
  availablePorts1,
  availablePorts2,
  availableCards1,
  availableCards2,
  areDevicesConnected
}: ConnectionInfoProps) => {
  if (!device1 || !device2) return null;

  return (
    <Fieldset>
      <Legend>Informacje</Legend>
      <FormField>
        <InfoContainer>
          {connectionType === 'port' ? (
            <>
              <InfoItem>Dostępne porty urządzenia "{device1?.urzadzenie.nazwa_urzadzenia}": {availablePorts1.length}</InfoItem>
              <InfoItem>Dostępne porty urządzenia "{device2?.urzadzenie.nazwa_urzadzenia}": {availablePorts2.length}</InfoItem>
              {areDevicesConnected(device1.urzadzenie.id_u, device2.urzadzenie.id_u, 'port') && (
                <WarningText>
                  ⚠️ Urządzenia są już połączone przez port
                </WarningText>
              )}
            </>
          ) : (
            <>
              <InfoItem>Dostępne karty WiFi urządzenia "{device1?.urzadzenie.nazwa_urzadzenia}": {availableCards1.length}</InfoItem>
              <InfoItem>Dostępne karty WiFi urządzenia "{device2?.urzadzenie.nazwa_urzadzenia}": {availableCards2.length}</InfoItem>
              {areDevicesConnected(device1.urzadzenie.id_u, device2.urzadzenie.id_u, 'wifi') && (
                <WarningText>
                  ⚠️ Urządzenia są już połączone przez WiFi
                </WarningText>
              )}
            </>
          )}
        </InfoContainer>
      </FormField>
    </Fieldset>
  );
};
