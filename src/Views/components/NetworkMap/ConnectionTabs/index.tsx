import { Tabs, TabButton } from './styled';

interface ConnectionTabsProps {
  activeTab: 'all' | 'port' | 'wifi';
  setActiveTab: (tab: 'all' | 'port' | 'wifi') => void;
}

export const ConnectionTabs = ({ activeTab, setActiveTab }: ConnectionTabsProps) => {
  return (
    <Tabs>
      <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>Wszystkie</TabButton>
      <TabButton active={activeTab === 'port'} onClick={() => setActiveTab('port')}>Porty</TabButton>
      <TabButton active={activeTab === 'wifi'} onClick={() => setActiveTab('wifi')}>WiFi</TabButton>
    </Tabs>
  );
};
