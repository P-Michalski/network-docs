import {
  SidePanel as StyledSidePanel,
  SidePanelList,
  SidePanelHeader
} from './styled';
import { DeviceListItem } from './DeviceListItem';

interface SidePanelProps {
  deviceList: any[];
  onEdit: (device: any) => void;
  onDelete: (id: number) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  deviceList,
  onEdit,
  onDelete
}) => {
  return (
    <StyledSidePanel>
      <SidePanelHeader>Lista urządzeń</SidePanelHeader>
      <SidePanelList>
        {deviceList.map((dev: any) => (
          <DeviceListItem
            key={dev.urzadzenie?.id_u}
            device={dev}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </SidePanelList>
    </StyledSidePanel>
  );
};