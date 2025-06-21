import styled from 'styled-components';

// Style używane przez wiele komponentów ConnectionForm

export const WideSidePanel = styled.aside`
  min-width: 480px;
  max-width: 700px;
  background: #fafbfc;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 28px 32px 24px 32px;
  box-shadow: 0 2px 12px #0001;
`;

export const WideSidePanelHeader = styled.h3`
  margin-top: 0;
  font-size: 1.3em;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

export const WideSidePanelList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const WideSidePanelListItem = styled.li`
  margin-bottom: 4px;
`;

export const RemoveConnectionButton = styled.button`
  background: #fff;
  color: #d32f2f;
  border: 1.5px solid #d32f2f;
  border-radius: 4px;
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  transition: background 0.2s, color 0.2s, border 0.2s;
  &:hover {
    background: #d32f2f;
    color: #fff;
    border-color: #d32f2f;
  }
`;

export const TabBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const TabButton = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? '#1976d2' : '#e3f2fd')};
  color: ${({ active }) => (active ? '#fff' : '#1976d2')};
  border: none;
  border-radius: 4px 4px 0 0;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #1565c0;
    color: #fff;
  }
`;

export const ErrorMsg = styled.span`
  display: block;
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 4px;
  font-weight: 500;
`;

export const InfoButton = styled.button`
  background: #fff;
  color: #1976d2;
  border: 1.5px solid #1976d2;
  border-radius: 4px;
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 16px;
  transition: background 0.2s, color 0.2s, border 0.2s;
  &:hover {
    background: #1976d2;
    color: #fff;
    border-color: #1976d2;
  }
`;

export const InfoPanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const InfoPanel = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
`;

export const InfoPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

export const InfoPanelTitle = styled.h3`
  margin: 0;
  font-size: 1.2em;
  font-weight: 700;
  color: #1976d2;
`;

export const InfoPanelCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

export const InfoPanelContent = styled.div`
  line-height: 1.6;
  color: #333;
`;

export const InfoRow = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const InfoLabel = styled.span`
  font-weight: 600;
  color: #555;
  min-width: 120px;
`;

export const InfoValue = styled.span`
  color: #333;
  flex: 1;
  text-align: right;
`;

export const InfoSection = styled.div`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoSectionTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 1em;
  font-weight: 600;
  color: #1976d2;
  border-bottom: 1px solid #e3f2fd;
  padding-bottom: 4px;
`;