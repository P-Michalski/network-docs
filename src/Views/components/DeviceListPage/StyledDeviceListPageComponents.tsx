import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background: #f7fafd;
`;

export const ListPanel = styled.div`
  width: 540px;
  border-right: 2px solid #1976d2;
  background: #fff;
  padding: 28px 18px 18px 18px;
  overflow-y: auto;
`;

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
  white-space: nowrap; /* zapobiega łamaniu tekstu */
  max-width: 180px; /* opcjonalnie ogranicz szerokość */
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const DetailsPanel = styled.div`
  flex: 1;
  padding: 36px 32px 32px 32px;
  background: #f7fafd;
  overflow-y: auto;
`;

export const DetailsTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 12px;
`;

export const DetailsSection = styled.div`
  margin-bottom: 18px;
`;

export const DetailsLabel = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
`;

export const DetailsValue = styled.div`
  color: #444;
  font-size: 15px;
  margin-bottom: 2px;
`;