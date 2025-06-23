import {
  Input,
  Select,
  ErrorMsg,
  RemoveButton
} from '../styled';

import { FormField } from '../../styled';

import type { UseFormReturn } from 'react-hook-form';
import type { DeviceDetailsForm } from '../../../pages/formSchemas/addDeviceFormSchema';

interface PortItemProps {
  index: number;
  fieldId: string;
  form: UseFormReturn<DeviceDetailsForm>;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const PortItem: React.FC<PortItemProps> = ({
  index: idx,
  fieldId,
  form,
  onRemove,
  canRemove
}) => {
  const { register, formState: { errors } } = form;

  return (
    <FormField key={fieldId}>
      <Input {...register(`porty.${idx}.nazwa`)} placeholder="Nazwa portu" />
      {errors.porty?.[idx]?.nazwa && <ErrorMsg>{errors.porty[idx]?.nazwa?.message}</ErrorMsg>}
      
      <Select {...register(`porty.${idx}.status`)}>
        <option value="">Wybierz status...</option>
        <option value="aktywny">Aktywny</option>
        <option value="nieaktywny">Nieaktywny</option>
      </Select>
      {errors.porty?.[idx]?.status && <ErrorMsg>{errors.porty[idx]?.status?.message}</ErrorMsg>}
      
      <Select {...register(`porty.${idx}.typ`)}>
        <option value="">Wybierz typ...</option>
        <option value="RJ45">RJ45</option>
        <option value="SFP">SFP</option>
      </Select>
      {errors.porty?.[idx]?.typ && <ErrorMsg>{errors.porty[idx]?.typ?.message}</ErrorMsg>}
      
      <Select {...register(`porty.${idx}.predkosc_portu.predkosc`)}>
        <option value="">Wybierz prędkość...</option>
        <option value="10Mb/s">10Mb/s</option>
        <option value="100Mb/s">100Mb/s</option>
        <option value="1Gb/s">1Gb/s</option>
        <option value="2,5Gb/s">2,5Gb/s</option>
        <option value="5Gb/s">5Gb/s</option>
        <option value="10Gb/s">10Gb/s</option>
        <option value="25Gb/s">25Gb/s</option>
      </Select>      {errors.porty?.[idx]?.predkosc_portu?.predkosc && <ErrorMsg>{errors.porty[idx]?.predkosc_portu?.predkosc?.message}</ErrorMsg>}
      
      <RemoveButton 
        type="button" 
        onClick={() => onRemove(idx)}
        disabled={!canRemove}
        title={!canRemove ? "Nie można usunąć - minimum portów dla tego typu urządzenia" : "Usuń port"}
      >
        Usuń port
      </RemoveButton>
    </FormField>
  );
};