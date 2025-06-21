import { LegendContainer, LegendTitle, LegendItem, LegendLine, ConnectionsTitle, ConnectionsContainer, ConnectionLabel } from './styled';

export const NetworkLegend = () => {
  return (
    <LegendContainer>
      <LegendTitle>Hierarchia sieci</LegendTitle>
      <LegendItem color="#e3f2fd" borderColor="#1976d2">Router</LegendItem>
      <LegendItem color="#e8f5e8" borderColor="#388e3c">Switch</LegendItem>
      <LegendItem color="#fff8e1" borderColor="#fbc02d">Access Point</LegendItem>
      <LegendItem color="#f5f5f5" borderColor="#616161">PC</LegendItem>
      <ConnectionsTitle>Połączenia:</ConnectionsTitle>
      <ConnectionsContainer>
        <LegendLine color="#1976d2" />
        <ConnectionLabel className="port">Port</ConnectionLabel>
        <LegendLine color="#fbc02d" dashed />
        <ConnectionLabel className="wifi">WiFi</ConnectionLabel>
      </ConnectionsContainer>
    </LegendContainer>
  );
};
