import styled from 'styled-components';

export const Input = styled.input`
  padding: 6px 10px;
  border: 1px solid #bbb;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 1rem;
`;

export const ErrorMsg = styled.span`
  color: #d32f2f;
  font-size: 0.9em;
  margin-top: 2px;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

export const Select = styled.select`
  padding: 6px 10px;
  border: 1px solid #bbb;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 1rem;
`;

// Nowe styled-componenty dla AddDevicePage
export const MainContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;
`;

export const DeviceForm = styled.form`
  flex: 1;
  margin-bottom: 32px;
  max-width: 600px;
`;

export const Button = styled.button`
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  margin: 4px 0;
  margin-left: 12px;
  transition: background 0.2s;
  &:hover {
    background: #1565c0;
  }
  &:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
  }
`;

export const CancelEditButton = styled(Button)`
  background: rgb(226, 43, 43);
  &:hover {
    background: rgb(194, 12, 12);
  }
  &:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
  }
`;

export const RemoveButton = styled.button`
  background: #fff;
  color: #d32f2f;
  border: 1px solid #d32f2f;
  border-radius: 4px;
  padding: 6px 14px;
  font-size: 1rem;
  cursor: pointer;
  margin: 4px 0 4px 8px;
  transition: background 0.2s, color 0.2s;
  &:hover:not(:disabled) {
    background: #d32f2f;
    color: #fff;
  }
  &:disabled {
    background: #f5f5f5;
    color: #bdbdbd;
    border-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

export const AddButton = styled.button`
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  margin: 8px 0 8px 0;
  transition: background 0.2s;
  &:hover {
    background: #388e3c;
  }
`;

export const ConnectionWarning = styled.div`
  color: red;
  font-weight: bold;
  margin-bottom: 16px;
`;