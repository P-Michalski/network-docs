import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px;
  text-align: center;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.h2`
  color: #666;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const LoadingSubtext = styled.p`
  color: #999;
  font-size: 1rem;
  max-width: 400px;
  line-height: 1.5;
`;

interface LoadingComponentProps {
  message?: string;
  subtext?: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ 
  message = "Ładowanie danych...",
  subtext = "Proszę czekać, trwa pobieranie danych z bazy."
}) => {
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>{message}</LoadingText>
      <LoadingSubtext>{subtext}</LoadingSubtext>
    </LoadingContainer>
  );
};

export default LoadingComponent;
