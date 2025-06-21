import styled from 'styled-components';

export const DeviceListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
`;

export const EditButton = styled.button`
  margin-right: 8px;
  background: #fffbe7;
  color: #ff9800;
  border: 1.5px solid #ff9800;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  &:hover {
    background: #ff9800;
    color: #fff;
    border-color: #ff9800;
  }
`;

export const DeleteButton = styled.button`
  color: #fff;
  background: #d32f2f;
  border: 1.5px solid #d32f2f;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  &:hover {
    background: #fff;
    color: #d32f2f;
    border-color: #d32f2f;
  }
`;

export const DeviceTypeSpan = styled.span`
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
  font-size: 0.98em;
  border-radius: 12px;
  padding: 4px 8px;
  margin-left: 4px;
  letter-spacing: 0.5px;
`;