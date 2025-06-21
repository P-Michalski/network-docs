import styled from 'styled-components';

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

export const DeviceTypeInfo = styled.div`
  color: #666;
  font-size: 16px;
`;
