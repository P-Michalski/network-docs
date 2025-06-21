import { Fieldset, Legend, FormField, Label } from '../../styled';

interface ConnectionTypeSelectorProps {
  connectionType: 'port' | 'wifi';
  onConnectionTypeChange: (type: 'port' | 'wifi') => void;
}

export const ConnectionTypeSelector = ({ 
  connectionType, 
  onConnectionTypeChange 
}: ConnectionTypeSelectorProps) => {
  return (
    <Fieldset>
      <Legend>Typ połączenia</Legend>
      <FormField>
        <Label>
          <input                  
            type="radio"
            value="port"
            checked={connectionType === 'port'}
            onChange={(e) => onConnectionTypeChange(e.target.value as 'port' | 'wifi')}
          />
          Port
        </Label>
        <Label>
          <input                  
            type="radio"
            value="wifi"
            checked={connectionType === 'wifi'}
            onChange={(e) => onConnectionTypeChange(e.target.value as 'port' | 'wifi')}
          />
          WiFi
        </Label>
      </FormField>
    </Fieldset>
  );
};
