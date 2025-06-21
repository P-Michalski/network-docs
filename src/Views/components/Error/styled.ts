import styled from 'styled-components';

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, #ff6b6b10 0%, #ee5a5210 100%);
  border-radius: 12px;
  margin: 20px;
`;

export const ErrorIcon = styled.div`
  font-size: 4rem;
  color: #e74c3c;
  margin-bottom: 20px;
  
  &::before {
    content: "⚠️";
  }
`;

export const ErrorTitle = styled.h1`
  color: #e74c3c;
  font-size: 2rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

export const ErrorMessage = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 25px;
  max-width: 500px;
  line-height: 1.6;
`;

export const ErrorDetails = styled.div`
  background: #f8f9fa;
  border-left: 4px solid #e74c3c;
  padding: 15px 20px;
  margin: 20px 0;
  border-radius: 4px;
  max-width: 600px;
  text-align: left;
`;

export const RetryButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #2980b9;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

export const TechnicalInfo = styled.small`
  color: #999;
  display: block;
  margin-top: 20px;
  font-family: 'Courier New', monospace;
`;