import styled from 'styled-components';

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
  background: #fff;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

export const DisabledOption = styled.option<{ isDisabled: boolean }>`
  color: ${props => props.isDisabled ? '#999' : 'inherit'};
  font-style: ${props => props.isDisabled ? 'italic' : 'normal'};
`;
