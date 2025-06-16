import { useEffect } from 'react';
import { type UseFormReturn, useFieldArray } from 'react-hook-form';

export const useFormSync = (
  form: UseFormReturn<any>,
  watchField: string,
  arrayName: string,
  defaultItem: any
) => {
  const { control, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: arrayName });
  const watchedValue = watch(watchField);

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

  // Custom remove function that also updates the count field
  const removeWithSync = (index: number) => {
    remove(index);
    setValue(watchField, Math.max(1, fields.length - 1)); // Minimum 1
  };

  return { 
    fields, 
    append: appendWithSync, 
    remove: removeWithSync,
    originalAppend: append,
    originalRemove: remove
  };
};