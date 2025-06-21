import { DeviceListItem as StyledDeviceListItem, EditButton, DeleteButton, DeviceTypeSpan } from './styled';

interface DeviceListItemProps {
  device: any;
  onEdit: (device: any) => void;
  onDelete: (id: number) => void;
}

export const DeviceListItem: React.FC<DeviceListItemProps> = ({
  device,
  onEdit,
  onDelete
}) => {
  const deviceName = device.urzadzenie?.nazwa_urzadzenia || '-';
  const deviceType = device.typ?.typ_u || '-';

  const handleDeleteClick = () => {
    if (window.confirm('Czy na pewno chcesz usunąć to urządzenie?')) {
      onDelete(device.urzadzenie?.id_u);
    }
  };

  return (
    <StyledDeviceListItem>
      <span>
        {deviceName} <DeviceTypeSpan>{deviceType}</DeviceTypeSpan>
      </span>
      <span>
        <EditButton type="button" onClick={() => onEdit(device)}>
          Edit
        </EditButton>
        <DeleteButton type="button" onClick={handleDeleteClick}>
          Usuń
        </DeleteButton>
      </span>
    </StyledDeviceListItem>
  );
};