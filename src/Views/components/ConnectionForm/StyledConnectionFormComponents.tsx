import styled from 'styled-components';

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
  margin-left: 16px;
  transition: background 0.2s, color 0.2s, border 0.2s;
  &:hover {
    background: #d32f2f;
    color: #fff;
    border-color: #d32f2f;
  }
`;
