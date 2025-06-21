import styled from 'styled-components';

export const DeviceItem = styled.div<{ selected?: boolean }>`
  border: 2px solid ${({ selected }) => (selected ? '#1976d2' : '#e3e3e3')};
  border-radius: 12px;
  margin-bottom: 18px;
  padding: 14px 16px;
  background: ${({ selected }) => (selected ? '#e3f2fd' : '#fafcff')};
  cursor: pointer;
  box-shadow: ${({ selected }) => (selected ? '0 2px 8px #1976d2aa' : '0 1px 4px #0001')};
  transition: border 0.2s, background 0.2s;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const DeviceName = styled.span`
  font-weight: 600;
`;

export const DeviceType = styled.span`
  color: #888;
  font-size: 14px;
`;
