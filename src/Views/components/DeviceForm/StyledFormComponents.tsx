import styled from 'styled-components';

export const FormField = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`;

export const Fieldset = styled.fieldset`
  border: 1px solid #ccc;
  padding: 8px;
  margin: 8px;
  min-width: 120px;
`;

export const Label = styled.label`
  font-weight: 500;
  margin-bottom: 4px;
`;

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

export const WifiCardBox = styled.div`
  margin-bottom: 16px;
  border: 1px solid #eee;
  padding: 8px;
`;

export const WifiCardInnerRow = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

export const SidePanel = styled.aside`
  min-width: 320px;
  max-width: 400px;
  background: #fafbfc;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px #0001;
`;

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

export const SidePanelHeader = styled.h3`
  margin-top: 0;
  font-size: 1.2em;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const SidePanelList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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
  &:hover {
    background: #d32f2f;
    color: #fff;
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

export const Legend = styled.legend`
  font-weight: 600;
  font-size: 1.05em;
  color: #1976d2;
  margin-bottom: 4px;
`;