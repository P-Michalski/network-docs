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

export const ConnectionsTitle = styled.div`
  margin: 10px 0 0 0;
  font-weight: 600;
  color: #1976d2;
`;

export const ConnectionsContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 0 0 0;
  font-size: 13px;
`;

export const ConnectionLabel = styled.span`
  margin-right: 10px;
  
  &.port {
    color: #1976d2;
  }
  
  &.wifi {
    color: #fbc02d;
  }
`;
