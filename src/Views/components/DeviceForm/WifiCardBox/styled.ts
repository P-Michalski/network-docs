import styled from "styled-components";

export const WifiCardBox = styled.div`
  margin-bottom: 16px;
  border: 1px solid #eee;
  padding: 8px;
`;

export const WifiCardInnerRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

export const WifiFieldset = styled.fieldset`
  border: 1px solid #ccc;
  padding: 8px;
  margin: 4px;
  min-width: 120px;
  flex: 1;
`;

export const WifiPasmoFieldset = styled.fieldset`
  border: 1px solid #ccc;
  padding: 8px;
  margin: 4px;
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  flex: none;
`;

export const WifiStandardFieldset = styled.fieldset`
  border: 1px solid #ccc;
  padding: 8px;
  margin: 4px;
  min-width: 120px;
  flex: 1;
`;

export const SpeedInfo = styled.div`
  fontSize: 12px;
  color: #666;
  margin-top: 4px;
`;