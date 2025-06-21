import styled from 'styled-components';

export const NodeBox = styled.div<{ deviceType?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background: ${props => {
    switch (props.deviceType) {
      case 'Router': return '#e3f2fd';     // Jasny niebieski
      case 'Switch': return '#e8f5e8';     // Jasny zielony  
      case 'Access Point': return '#fff8e1'; // Jasny żółty
      case 'PC': return '#f5f5f5';         // Jasny szary
      default: return '#fff';
    }
  }};
  border: 2px solid ${props => {
    switch (props.deviceType) {
      case 'Router': return '#1976d2';     // Niebieski
      case 'Switch': return '#388e3c';     // Zielony
      case 'Access Point': return '#fbc02d'; // Żółty
      case 'PC': return '#616161';         // Szary
      default: return '#1976d2';
    }
  }};
  border-radius: 12px;
  min-width: 80px;
  box-shadow: 0 2px 8px #0001;
`;

export const DeviceLabel = styled.div`
  font-weight: 600;
  margin-top: 4px;
  font-size: 14px;
`;

export const DeviceType = styled.div`
  font-size: 11px;
  color: #888;
`;

export const DeviceInfo = styled.div`
  font-size: 9px;
  color: #666;
  margin-top: 2px;
`;
