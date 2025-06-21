import { ListPanel, PanelTitle } from './styled';
import { DeviceFilterTabs } from '../DeviceFilterTabs';
import { DeviceListItem } from '../DeviceListItem';

interface DeviceListPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  deviceTypes: string[];
  getTabLabel: (tab: string) => string;
  filteredDevices: any[];
  selectedDeviceId: number | null;
  setSelectedDeviceId: (id: number) => void;
}

export const DeviceListPanel = ({ 
  activeTab, 
  setActiveTab, 
  deviceTypes, 
  getTabLabel, 
  filteredDevices, 
  selectedDeviceId, 
  setSelectedDeviceId 
}: DeviceListPanelProps) => {  
    return (
    <ListPanel>
      <PanelTitle>Lista urządzeń</PanelTitle>
      <DeviceFilterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceTypes={deviceTypes}
        getTabLabel={getTabLabel}
      />
      {filteredDevices.map(device => (
        <DeviceListItem
          key={device.urzadzenie.id_u}
          device={device}
          selected={selectedDeviceId === device.urzadzenie.id_u}
          onSelect={setSelectedDeviceId}
        />
      ))}
    </ListPanel>
  );
};
