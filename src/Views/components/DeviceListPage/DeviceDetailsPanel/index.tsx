import { DetailsPanel, EmptyMessage } from './styled';
import { DeviceDetails } from '../DeviceDetails';

interface DeviceDetailsPanelProps {
  selectedDevice: any | null;
}

export const DeviceDetailsPanel = ({ selectedDevice }: DeviceDetailsPanelProps) => {
  return (
    <DetailsPanel>
      {selectedDevice ? (
        <DeviceDetails device={selectedDevice} />
      ) : (
        <EmptyMessage>Wybierz urządzenie z listy, aby zobaczyć szczegóły.</EmptyMessage>
      )}
    </DetailsPanel>
  );
};
