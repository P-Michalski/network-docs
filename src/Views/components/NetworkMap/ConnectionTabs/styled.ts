import styled from 'styled-components';

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
