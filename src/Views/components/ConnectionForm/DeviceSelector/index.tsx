import { Select, DisabledOption } from './styled';
import { Fieldset, Legend, FormField } from '../../styled';
import { ErrorMsg } from '../styled';

interface DeviceSelectorProps {
  title: string;
  devices: any[];
  selectedDevice: number | '';
  onDeviceChange: (deviceId: number | '') => void;
  connectionType: 'port' | 'wifi';
  selectedPortOrCard: number | '';
  onPortOrCardChange: (id: number | '') => void;
  allPorts: any[];
  availableCards: any[];
  isPortOccupied: (portId: number, deviceId: number) => boolean | undefined;
  validationErrors: {
    device?: string;
    portOrCard?: string;
  };
  excludeDeviceId?: number;
}

export const DeviceSelector = ({
  title,
  devices,
  selectedDevice,
  onDeviceChange,
  connectionType,
  selectedPortOrCard,
  onPortOrCardChange,
  allPorts,
  availableCards,
  isPortOccupied,
  validationErrors,
  excludeDeviceId
}: DeviceSelectorProps) => {
  const filteredDevices = excludeDeviceId 
    ? devices.filter(device => device.urzadzenie.id_u !== excludeDeviceId)
    : devices;

  return (
    <Fieldset>
      <Legend>{title}</Legend>
      <FormField>        <Select 
          value={selectedDevice} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onDeviceChange(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Wybierz urządzenie...</option>
          {filteredDevices.map(device => (
            <option key={device.urzadzenie.id_u} value={device.urzadzenie.id_u}>
              {device.urzadzenie.nazwa_urzadzenia}
            </option>
          ))}
        </Select>
        {validationErrors.device && <ErrorMsg>{validationErrors.device}</ErrorMsg>}
      </FormField>
        
      {selectedDevice && (
        <FormField>
          <Select value={selectedPortOrCard} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onPortOrCardChange(e.target.value ? Number(e.target.value) : '')}>
            <option value="">
              {connectionType === 'port' ? 'Wybierz port...' : 'Wybierz kartę WiFi...'}
            </option>
            {connectionType === 'port' 
              ? allPorts.map(port => {
                  const isOccupied = isPortOccupied(port.id_p, selectedDevice as number);
                  const isInactive = port.status !== 'aktywny';
                  const isDisabled = isOccupied || isInactive;
                  
                  return (
                    <DisabledOption 
                      key={port.id_p} 
                      value={port.id_p}
                      disabled={isDisabled}
                      isDisabled={isDisabled}
                    >
                      {port.nazwa} ({port.typ})
                      {isOccupied && ' - zajęty'}
                      {isInactive && ' - nieaktywny'}
                    </DisabledOption>
                  );                      
                })                    
              : availableCards.map(card => (
                  <option key={card.id_k} value={card.id_k}>
                    {card.nazwa}
                  </option>
                ))
            }
          </Select>
          {validationErrors.portOrCard && <ErrorMsg>{validationErrors.portOrCard}</ErrorMsg>}
        </FormField>
      )}
    </Fieldset>
  );
};
