import { SidePanel, CloseButton, PanelTitle, PanelSection, PanelLabel, DeviceTypeInfo } from './styled';
import { ConnectionTabs } from '../ConnectionTabs';
import { ConnectionList } from '../ConnectionList';

interface DeviceInfoPanelProps {
  selectedDevice: any;
  onClose: () => void;
  activeTab: 'all' | 'port' | 'wifi';
  setActiveTab: (tab: 'all' | 'port' | 'wifi') => void;
  filteredConnections: any[];
}

export const DeviceInfoPanel = ({ 
  selectedDevice, 
  onClose, 
  activeTab, 
  setActiveTab, 
  filteredConnections 
}: DeviceInfoPanelProps) => {
  return (
    <SidePanel>
      <CloseButton onClick={onClose} title="Zamknij panel">×</CloseButton>
      <PanelTitle>{selectedDevice.urzadzenie.nazwa_urzadzenia}</PanelTitle>
      <PanelSection>
        <PanelLabel>Typ:</PanelLabel>
        <DeviceTypeInfo>{selectedDevice.typ?.typ_u}</DeviceTypeInfo>
      </PanelSection>
      <ConnectionTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <PanelSection>
        <PanelLabel>Połączenia:</PanelLabel>
        <ConnectionList connections={filteredConnections} />
      </PanelSection>
    </SidePanel>
  );
};
