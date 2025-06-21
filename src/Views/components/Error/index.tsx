import React from 'react';
import { ErrorContainer, ErrorIcon, ErrorTitle, ErrorMessage, ErrorDetails, RetryButton, TechnicalInfo} from './styled';

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
