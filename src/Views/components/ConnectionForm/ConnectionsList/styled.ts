import styled from 'styled-components';

export const ConnectionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const ConnectionDevices = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  
  > div {
    flex: 1;
    text-align: center;
  }
`;

export const ConnectionArrow = styled.div`
  font-size: 18px;
  color: #666;
`;

export const ConnectionActions = styled.div`
  display: flex;
  gap: 5px;
  margin-left: 10px;
`;
