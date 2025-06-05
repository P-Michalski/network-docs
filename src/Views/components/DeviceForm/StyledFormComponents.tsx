import styled from 'styled-components';

export const FormField = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
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