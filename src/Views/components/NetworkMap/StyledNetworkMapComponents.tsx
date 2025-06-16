import styled from 'styled-components';

export const LegendContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  width: 200px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-size: 12px;
  z-index: 3000;
  max-width: 200px;
`;

export const LegendTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

export const LegendItem = styled.div<{ color: string; borderColor: string }>`
  display: flex;
  align-items: center;
  margin: 4px 0;
  
  &::before {
    content: '';
    width: 16px;
    height: 12px;
    background: ${props => props.color};
    border: 2px solid ${props => props.borderColor};
    border-radius: 3px;
    margin-right: 8px;
  }
`;

export const LegendLine = styled.div<{ color: string; dashed?: boolean }>`
  display: inline-block;
  width: 32px;
  height: 0;
  border-top: 4px ${props => props.dashed ? 'dashed' : 'solid'} ${props => props.color};
  margin-right: 8px;
  vertical-align: middle;
`;

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

export const SidePanel = styled.div`
  position: fixed;
  top: 90px;
  left: 0;
  width: 400px;
  height: calc(100vh - 100px);
  background: #f7fafd;
  border-right: 2px solid #1976d2;
  box-shadow: 2px 0 12px #0002;
  padding: 28px 22px 22px 22px;
  z-index: 2000;
  overflow-y: auto;
  border-radius: 0 18px 18px 0;
  display: flex;
  flex-direction: column;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px #1976d2aa;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #1976d2;
    color: #fff;
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
`;

export const TabButton = styled.button<{ active?: boolean }>`
  padding: 7px 18px;
  border: none;
  border-radius: 16px 16px 0 0;
  background: ${({ active }) => (active ? '#1976d2' : '#e3f2fd')};
  color: ${({ active }) => (active ? '#fff' : '#1976d2')};
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  box-shadow: ${({ active }) => (active ? '0 2px 8px #1976d2aa' : 'none')};
  transition: background 0.2s, color 0.2s;
  outline: none;
`;

export const PanelTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #1976d2;
  letter-spacing: 0.5px;
`;

export const PanelSection = styled.div`
  margin-bottom: 18px;
`;

export const PanelLabel = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
`;

export const PanelList = styled.ul`
  margin: 0 0 0 12px;
  padding: 0;
  font-size: 15px;
  color: #444;
  list-style: disc inside;
`;

export const PanelNoData = styled.div`
  color: #888;
  font-size: 15px;
  margin-top: 10px;
`;