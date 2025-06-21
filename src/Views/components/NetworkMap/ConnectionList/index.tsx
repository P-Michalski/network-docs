import { PanelList, PanelNoData, ConnectionItem, ConnectionHighlight } from './styled';

interface Connection {
  type: 'port' | 'wifi';
  sourcePort?: string;
  sourceCard?: string;
  targetDevice: string;
  targetPort?: string;
  targetCard?: string;
}

interface ConnectionListProps {
  connections: Connection[];
}

export const ConnectionList = ({ connections }: ConnectionListProps) => {
  if (connections.length === 0) {
    return <PanelNoData>Brak połączeń</PanelNoData>;
  }

  return (
    <PanelList>
      {connections.map((conn, idx) => (
        <ConnectionItem key={idx}>
          {conn.type === 'port' ? (
            <>
              Port <ConnectionHighlight>{conn.sourcePort}</ConnectionHighlight> → {conn.targetDevice} (Port {conn.targetPort})
            </>
          ) : (
            <>
              WiFi <ConnectionHighlight>{conn.sourceCard}</ConnectionHighlight> → {conn.targetDevice} ({conn.targetCard})
            </>
          )}
        </ConnectionItem>
      ))}
    </PanelList>
  );
};
