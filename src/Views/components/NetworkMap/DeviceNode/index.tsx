import { Handle, Position } from 'react-flow-renderer';
import { FaServer, FaWifi, FaDesktop, FaNetworkWired } from 'react-icons/fa';
import { NodeBox, DeviceLabel, DeviceType, DeviceInfo } from './styled';

const iconMap: Record<string, React.ReactNode> = {
  'Router': <FaNetworkWired size={32} color="#1976d2" />,
  'Switch': <FaServer size={32} color="#388e3c" />,
  'PC': <FaDesktop size={32} color="#616161" />,
  'Access Point': <FaWifi size={32} color="#fbc02d" />,
};

interface DeviceNodeProps {
  data: {
    label: string;
    type: string;
    ports?: any[];
    wifiCards?: any[];
  };
}

export const DeviceNode = ({ data }: DeviceNodeProps) => {
  const { ports = [], wifiCards = [] } = data;
  
  return (
    <>
      {/* Dynamic handles for ports - left side */}
      {ports.map((port: any, index: number) => {
        const topPosition = 20 + (index * (60 / Math.max(ports.length - 1, 1)));
        return (
          <>
            <Handle
              key={`port-out-${port.id_p}`}
              type="source"
              position={Position.Left}
              id={`port-out-${port.id_p}`}
              style={{ 
                background: '#1976d2', 
                top: `${topPosition}%`,
                width: '8px',
                height: '8px'
              }}
            />
            <Handle
              key={`port-in-${port.id_p}`}
              type="target"
              position={Position.Right}
              id={`port-in-${port.id_p}`}
              style={{ 
                background: '#1976d2', 
                top: `${topPosition}%`,
                width: '8px',
                height: '8px'
              }}
            />
          </>
        );
      })}
      
      {/* Dynamic handles for WiFi cards - top and bottom */}
      {wifiCards.map((card: any, index: number) => {
        const leftPosition = 20 + (index * (60 / Math.max(wifiCards.length - 1, 1)));
        return (
          <>
            <Handle
              key={`wifi-out-${card.id_k}`}
              type="source"
              position={Position.Top}
              id={`wifi-out-${card.id_k}`}
              style={{ 
                background: '#fbc02d', 
                left: `${leftPosition}%`,
                width: '8px',
                height: '8px'
              }}
            />
            <Handle
              key={`wifi-in-${card.id_k}`}
              type="target"
              position={Position.Bottom}
              id={`wifi-in-${card.id_k}`}
              style={{ 
                background: '#fbc02d', 
                left: `${leftPosition}%`,
                width: '8px',
                height: '8px'
              }}
            />
          </>
        );
      })}
      
      <NodeBox deviceType={data.type}>
        {iconMap[data.type] || <FaServer size={32} color="#888" />}
        <DeviceLabel>{data.label}</DeviceLabel>
        <DeviceType>{data.type}</DeviceType>
        {/* Show port and WiFi card counts */}
        <DeviceInfo>
          {ports.length > 0 && `${ports.length}P`}
          {ports.length > 0 && wifiCards.length > 0 && ' • '}
          {wifiCards.length > 0 && `${wifiCards.length}K`}
        </DeviceInfo>
      </NodeBox>
    </>
  );
};
