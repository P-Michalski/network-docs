import { Tabs, TabButton } from './styled';

interface DeviceFilterTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  deviceTypes: string[];
  getTabLabel: (tab: string) => string;
}

export const DeviceFilterTabs = ({ activeTab, setActiveTab, deviceTypes, getTabLabel }: DeviceFilterTabsProps) => {
  return (
    <Tabs>
      <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
        {getTabLabel('all')}
      </TabButton>
      {deviceTypes.map(type => (
        <TabButton key={type} active={activeTab === type} onClick={() => setActiveTab(type)}>
          {getTabLabel(type)}
        </TabButton>
      ))}
    </Tabs>
  );
};
