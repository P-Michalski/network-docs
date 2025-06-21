import { GeneralErrorContainer, SuccessMessage } from './styled';
import { ErrorMsg } from '../styled';

interface FormMessagesProps {
  generalError?: string;
  operationError?: string | null;
  success?: string | null;
  operationLoading: boolean;
}

export const FormMessages = ({ 
  generalError, 
  operationError, 
  success 
}: FormMessagesProps) => {
  return (
    <>
      {generalError && (
        <GeneralErrorContainer>
          <ErrorMsg>{generalError}</ErrorMsg>
        </GeneralErrorContainer>
      )}
      
      {operationError && <ErrorMsg>{operationError}</ErrorMsg>}
      
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </>
  );
};
