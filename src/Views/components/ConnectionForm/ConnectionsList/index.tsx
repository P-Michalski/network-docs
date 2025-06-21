import { 
  WideSidePanel, 
  WideSidePanelHeader, 
  WideSidePanelList, 
  WideSidePanelListItem,
  TabBar,
  TabButton,
  RemoveConnectionButton,
  InfoButton
} from '../styled';
import { ConnectionItem, ConnectionDevices, ConnectionArrow, ConnectionActions } from './styled';

interface Connection {
  type: 'port' | 'wifi';
  device1: string;
  device2: string;
  port1?: string;
  port2?: string;
  card1?: string;
  card2?: string;
}

interface ConnectionsListProps {
  allConnections: Connection[];
  filteredConnections: Connection[];
  panelTab: 'all' | 'port' | 'wifi';
  onTabChange: (tab: 'all' | 'port' | 'wifi') => void;
  onShowInfo: (connection: Connection) => void;
  onRemoveConnection: (connection: Connection) => void;
}

export const ConnectionsList = ({
  allConnections,
  filteredConnections,
  panelTab,
  onTabChange,
  onShowInfo,
  onRemoveConnection
}: ConnectionsListProps) => {
  return (
    <WideSidePanel>
      <WideSidePanelHeader>Lista połączeń</WideSidePanelHeader>
      
      <TabBar>
        <TabButton 
          active={panelTab === 'all'} 
          onClick={() => onTabChange('all')}
        >
          Wszystkie ({allConnections.length})
        </TabButton>
        <TabButton 
          active={panelTab === 'port'} 
          onClick={() => onTabChange('port')}
        >
          Porty ({allConnections.filter(c => c.type === 'port').length})
        </TabButton>
        <TabButton 
          active={panelTab === 'wifi'} 
          onClick={() => onTabChange('wifi')}
        >
          WiFi ({allConnections.filter(c => c.type === 'wifi').length})
        </TabButton>
      </TabBar>

      <WideSidePanelList>          
        {filteredConnections.map((connection, index) => (
          <WideSidePanelListItem key={index}>
            <ConnectionItem>
              <ConnectionDevices>
                <div>
                  <strong>{connection.device1}</strong>
                  <br />
                  <small>{connection.type === 'port' ? connection.port1 : connection.card1}</small>
                </div>
                <ConnectionArrow>↔</ConnectionArrow>
                <div>
                  <strong>{connection.device2}</strong>
                  <br />
                  <small>{connection.type === 'port' ? connection.port2 : connection.card2}</small>
                </div>
              </ConnectionDevices>
              <ConnectionActions>
                <InfoButton onClick={() => onShowInfo(connection)}>
                  Info
                </InfoButton>
                <RemoveConnectionButton onClick={() => onRemoveConnection(connection)}>
                  Usuń
                </RemoveConnectionButton>
              </ConnectionActions>
            </ConnectionItem>
          </WideSidePanelListItem>
        ))}
        {filteredConnections.length === 0 && (
          <WideSidePanelListItem>
            <div>Brak połączeń do wyświetlenia</div>
          </WideSidePanelListItem>
        )}
      </WideSidePanelList>
    </WideSidePanel>
  );
};
