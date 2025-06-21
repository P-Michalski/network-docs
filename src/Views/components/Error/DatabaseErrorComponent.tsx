import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
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

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: #e74c3c;
  margin-bottom: 20px;
  
  &::before {
    content: "⚠️";
  }
`;

const ErrorTitle = styled.h1`
  color: #e74c3c;
  font-size: 2rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 25px;
  max-width: 500px;
  line-height: 1.6;
`;

const ErrorDetails = styled.div`
  background: #f8f9fa;
  border-left: 4px solid #e74c3c;
  padding: 15px 20px;
  margin: 20px 0;
  border-radius: 4px;
  max-width: 600px;
  text-align: left;
`;

const RetryButton = styled.button`
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

const TechnicalInfo = styled.small`
  color: #999;
  display: block;
  margin-top: 20px;
  font-family: 'Courier New', monospace;
`;

interface DatabaseErrorProps {
  error?: string;
  onRetry?: () => void;
  showTechnicalDetails?: boolean;
}

const DatabaseErrorComponent: React.FC<DatabaseErrorProps> = ({ 
  error = "Nie można nawiązać połączenia z bazą danych",
  onRetry,
  showTechnicalDetails = false
}) => {
  return (
    <ErrorContainer>
      <ErrorIcon />
      <ErrorTitle>Brak połączenia z bazą danych</ErrorTitle>
      <ErrorMessage>
        Aplikacja nie może pobrać danych z serwera. Sprawdź połączenie internetowe 
        lub skontaktuj się z administratorem systemu.
      </ErrorMessage>
      
      {showTechnicalDetails && (
        <ErrorDetails>
          <strong>Szczegóły błędu:</strong><br />
          {error}
        </ErrorDetails>
      )}
      
      {onRetry && (
        <RetryButton onClick={onRetry}>
          🔄 Spróbuj ponownie
        </RetryButton>
      )}
      
      <TechnicalInfo>
        Kod błędu: DB_CONNECTION_FAILED | Timestamp: {new Date().toISOString()}
      </TechnicalInfo>
    </ErrorContainer>
  );
};

export default DatabaseErrorComponent;
