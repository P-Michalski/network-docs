import { DeviceItem, DeviceName, DeviceType } from './styled';

interface DeviceListItemProps {
  device: any;
  selected: boolean;
  onSelect: (deviceId: number) => void;
}

export const DeviceListItem = ({ device, selected, onSelect }: DeviceListItemProps) => {
  return (
    <DeviceItem
      selected={selected}
      onClick={() => onSelect(device.urzadzenie.id_u ?? 0)}
    >
      <DeviceName>{device.urzadzenie.nazwa_urzadzenia}</DeviceName>
      <DeviceType>({device.typ?.typ_u})</DeviceType>
    </DeviceItem>
  );
};
