import { useEffect } from 'react';
import { type UseFormReturn, useFieldArray } from 'react-hook-form';
import { getMinPortsForDeviceType } from '../Views/pages/formSchemas/addDeviceFormSchema';

export const useFormSync = (
  form: UseFormReturn<any>,
  watchField: string,
  arrayName: string,
  defaultItem: any,
  minItems?: number
) => {
  const { control, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: arrayName });
  const watchedValue = watch(watchField);
  
  // Dla portów, sprawdź minimum według typu urządzenia
  const deviceType = watch('typ.typ_u');
  const dynamicMinItems = arrayName === 'porty' && deviceType ? 
    getMinPortsForDeviceType(deviceType) : (minItems || 1);

  useEffect(() => {
    if (typeof watchedValue === 'number' && watchedValue > 0) {
      const diff = watchedValue - fields.length;
      if (diff > 0) {
        // Add missing fields
        for (let i = 0; i < diff; i++) {
          append(defaultItem);
        }
      } else if (diff < 0) {
        // Remove extra fields
        for (let i = 0; i < Math.abs(diff); i++) {
          remove(fields.length - 1 - i);
        }
      }
    }
  }, [watchedValue, fields.length, append, remove, defaultItem]);

  // Custom append function that also updates the count field
  const appendWithSync = (item: any) => {
    append(item);
    setValue(watchField, fields.length + 1);
  };

  // Custom remove function that also updates the count field and respects minimum
  const removeWithSync = (index: number) => {
    const newLength = fields.length - 1;
    if (newLength >= dynamicMinItems) {
      remove(index);
      setValue(watchField, Math.max(dynamicMinItems, newLength));
    }
  };

  return { 
    fields, 
    append: appendWithSync, 
    remove: removeWithSync,
    originalAppend: append,
    originalRemove: remove,
    canRemove: fields.length > dynamicMinItems
  };
};