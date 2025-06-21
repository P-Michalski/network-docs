import type { UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';
import {
  WifiCardBox as StyledWifiCardBox,
  WifiCardInnerRow,
  WifiPasmoFieldset,
  WifiStandardFieldset,
  SpeedInfo
} from './styled';

import { getCompatibleBands, getMaxSpeedForWifiVersion, type DeviceDetailsForm } from '../../../pages/formSchemas/addDeviceFormSchema';

import { 
  Input,
  Select,
  ErrorMsg,
  RemoveButton,
} from '../styled';

import { FormField, Legend, Label } from '../../styled';

interface WifiCardBoxProps {
  index: number;
  fieldId: string;
  form: UseFormReturn<DeviceDetailsForm>;
  onRemove: (index: number) => void;
}

export const WifiCardBox: React.FC<WifiCardBoxProps> = ({
  index: idx,
  fieldId,
  form,
  onRemove
}) => {
  const { register, formState: { errors }, watch, setValue } = form;
  
  // Logika przeniesiona z AddDevicePage:
  const currentWifiVersion = watch(`karty_wifi.${idx}.wersja.wersja`) || '';
  const compatibleBands = getCompatibleBands(currentWifiVersion);
  const maxSpeed = getMaxSpeedForWifiVersion(currentWifiVersion);
  const currentWifiValues = watch('karty_wifi') || [];

  // Automatycznie ustaw nieobsługiwane pasma przy zmianie wersji WiFi
  useEffect(() => {
    if (currentWifiVersion) {
      // Ustaw nieobsługiwane pasma na "Nie" (0)
      if (!compatibleBands.pasmo24GHz) {
        setValue(`karty_wifi.${idx}.pasmo.pasmo24GHz`, 0);
      }
      if (!compatibleBands.pasmo5GHz) {
        setValue(`karty_wifi.${idx}.pasmo.pasmo5GHz`, 0);
      }
      if (!compatibleBands.pasmo6GHz) {
        setValue(`karty_wifi.${idx}.pasmo.pasmo6GHz`, 0);
      }
    }
  }, [currentWifiVersion, setValue, idx, compatibleBands]);

  return (
    <StyledWifiCardBox key={fieldId}>
      <FormField>
        <Label>Nazwa karty:</Label>
        <Input {...register(`karty_wifi.${idx}.nazwa`)} placeholder="Nazwa karty WiFi" />
        {errors.karty_wifi?.[idx]?.nazwa && <ErrorMsg>{errors.karty_wifi[idx]?.nazwa?.message}</ErrorMsg>}
        <Label>Status:</Label>
        <Select {...register(`karty_wifi.${idx}.status`)}>
          <option value="">Wybierz status...</option>
          <option value="aktywny">Aktywny</option>
          <option value="nieaktywny">Nieaktywny</option>
        </Select>
        {errors.karty_wifi?.[idx]?.status && <ErrorMsg>{errors.karty_wifi[idx]?.status?.message}</ErrorMsg>}
      </FormField>
      <WifiCardInnerRow>                
        <WifiPasmoFieldset>
          <Legend>Pasmo</Legend>
          <FormField>
            <Label>2.4GHz:</Label>
            <Select
              {...register(`karty_wifi.${idx}.pasmo.pasmo24GHz`, { setValueAs: v => Number(v) })}
              defaultValue={currentWifiValues[idx]?.pasmo?.pasmo24GHz === 1 ? '1' : '0'}
              disabled={!compatibleBands.pasmo24GHz}
            >
              <option value="1">Tak</option>
              <option value="0">Nie</option>
            </Select>
          </FormField>
          <FormField>
            <Label>5GHz:</Label>
            <Select
              {...register(`karty_wifi.${idx}.pasmo.pasmo5GHz`, { setValueAs: v => Number(v) })}
              defaultValue={currentWifiValues[idx]?.pasmo?.pasmo5GHz === 1 ? '1' : '0'}
              disabled={!compatibleBands.pasmo5GHz}
            >
              <option value="1">Tak</option>
              <option value="0">Nie</option>
            </Select>
          </FormField>
          <FormField>
            <Label>6GHz:</Label>
            <Select
              {...register(`karty_wifi.${idx}.pasmo.pasmo6GHz`, { setValueAs: v => Number(v) })}
              defaultValue={currentWifiValues[idx]?.pasmo?.pasmo6GHz === 1 ? '1' : '0'}
              disabled={!compatibleBands.pasmo6GHz}
            >
              <option value="1">Tak</option>
              <option value="0">Nie</option>
            </Select>
          </FormField>
          {errors.karty_wifi?.[idx]?.pasmo && <ErrorMsg>{errors.karty_wifi[idx]?.pasmo?.message}</ErrorMsg>}
        </WifiPasmoFieldset>
        <WifiStandardFieldset>
          <Legend>Wersja WiFi</Legend>
          <FormField>
            <Label>Wersja:</Label>                    
            <Select {...register(`karty_wifi.${idx}.wersja.wersja`)}>
              <option value="">Wybierz wersję...</option>
              <option value="B">B</option>
              <option value="G">G</option>
              <option value="N">N</option>
              <option value="AC">AC</option>
              <option value="AX">AX</option>
              <option value="BE">BE</option>
            </Select>
          </FormField>
          {errors.karty_wifi?.[idx]?.wersja?.wersja && <ErrorMsg>{errors.karty_wifi[idx]?.wersja?.wersja?.message}</ErrorMsg>}
        </WifiStandardFieldset>                
        <WifiStandardFieldset>
          <Legend>Prędkość</Legend>
          <FormField>
            <Label>Prędkość (Mb/s):</Label>                    
            <Input 
              type="number" 
              placeholder="Prędkość w Mb/s"
              min={0}
              max={maxSpeed > 0 ? maxSpeed : undefined}
              onKeyDown={(e) => {
                // Blokuj znak minus, plus, e, E, przecinek, kropkę i inne znaki nie będące cyframi
                if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || 
                    e.key === '.' || e.key === ',' || e.key === ',') {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                // Blokuj wklejanie tekstu zawierającego niedozwolone znaki (tylko cyfry)
                const paste = e.clipboardData.getData('text');
                if (!/^\d+$/.test(paste)) {
                  e.preventDefault();
                }
              }}
              {...register(`karty_wifi.${idx}.predkosc.predkosc`, { setValueAs: v => Number(v) })}
            />
            {maxSpeed > 0 && currentWifiVersion && (
              <SpeedInfo>
                Maksymalna prędkość dla WiFi {currentWifiVersion}:
                <br />
                {maxSpeed} Mb/s
              </SpeedInfo>
            )}
          </FormField>
          {errors.karty_wifi?.[idx]?.predkosc?.predkosc && <ErrorMsg>{errors.karty_wifi[idx]?.predkosc?.predkosc?.message}</ErrorMsg>}
        </WifiStandardFieldset>
      </WifiCardInnerRow>
      <RemoveButton type="button" onClick={() => onRemove(idx)}>Usuń kartę WiFi</RemoveButton>
    </StyledWifiCardBox>
  );
};