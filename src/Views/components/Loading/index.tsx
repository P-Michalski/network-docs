import React from 'react';
import { LoadingContainer, Spinner, LoadingSubtext, LoadingText } from './styled';

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
