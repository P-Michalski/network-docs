import { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormSync } from '../../../hooks/useFormSync';
import { createDeviceDetailsSchema, type DeviceDetailsForm, defaultFormValues, getCompatibleBands, getMinPortsForDeviceType } from '../../pages/formSchemas/addDeviceFormSchema';
import { Input, ErrorMsg, Select, DeviceForm as StyledDeviceForm, CancelEditButton, Button, AddButton, ConnectionWarning } from './styled';
import { WifiCardBox } from './WifiCardBox';
import { PortItem } from './PortItem';
import { FormField, Legend, Label, Fieldset } from '../styled';

interface DeviceFormProps {
  deviceList: any[];
  editingDevice: any | null;
  onSubmit: (data: DeviceDetailsForm) => void;
  onCancelEdit: () => void;
}

export const DeviceForm = ({ deviceList, editingDevice, onSubmit, onCancelEdit }: DeviceFormProps) => {
  // Tworzenie dynamicznego schematu z walidacją unikalności MAC
  const schema = useMemo(() => 
    createDeviceDetailsSchema(deviceList, editingDevice?.urzadzenie?.id_u), 
    [deviceList, editingDevice?.urzadzenie?.id_u]
  );
  
  const form = useForm<DeviceDetailsForm>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  });
  const { register, handleSubmit, reset, watch, formState: { errors } } = form;
  
  // Aktualizuj resolver gdy zmieni się schemat
  useEffect(() => {
    form.control._options.resolver = zodResolver(schema);
  }, [schema, form.control]);
  
  const currentDeviceType = watch('typ.typ_u');
  const minPorts = getMinPortsForDeviceType(currentDeviceType);
  
  // Automatycznie ustaw ilość portów na minimum przy zmianie typu urządzenia
  useEffect(() => {
    if (currentDeviceType && minPorts > 0) {
      const currentPortCount = watch('urzadzenie.ilosc_portow');
      if (currentPortCount < minPorts) {
        form.setValue('urzadzenie.ilosc_portow', minPorts);
      }
    }
  }, [currentDeviceType, minPorts, form, watch]);
  
  // Użyj hooków do synchronizacji pól
  const { fields: portFields, append: appendPort, remove: removePort } = useFormSync(form, 'urzadzenie.ilosc_portow', 'porty', { 
    nazwa: '', 
    status: '',    
    typ: '' as any,
    predkosc_portu: { predkosc: '1Gb/s' as const },
    polaczenia_portu: [] 
  });
  const { fields: wifiFields, append: appendWifi, remove: removeWifi } = useFieldArray({ control: form.control, name: 'karty_wifi' });
  
  // Automatycznie zarządzaj kartami WiFi przy zmianie typu urządzenia
  useEffect(() => {
    const currentWifiCount = wifiFields.length;
    
    if (currentDeviceType === 'Switch') {
      // Dla Switch - usuń wszystkie karty WiFi
      if (currentWifiCount > 0) {
        for (let i = currentWifiCount - 1; i >= 0; i--) {
          removeWifi(i);
        }
      }
    } else if (currentDeviceType && currentWifiCount === 0) {
      // Dla innych typów - dodaj jedną kartę WiFi jeśli nie ma żadnej
      appendWifi({
        nazwa: '', 
        status: '',
        pasmo: { pasmo24GHz: 0, pasmo5GHz: 0, pasmo6GHz: 0 },
        wersja: { wersja: '' as any },
        predkosc: { predkosc: 0 },
      });
    }
  }, [currentDeviceType, wifiFields.length, removeWifi, appendWifi]);

  // Automatycznie ustaw nieobsługiwane pasma na "Nie" przy zmianie wersji WiFi
  useEffect(() => {
    wifiFields.forEach((_, idx) => {
      const currentWifiVersion = watch(`karty_wifi.${idx}.wersja.wersja`);
      if (currentWifiVersion) {
        const compatibleBands = getCompatibleBands(currentWifiVersion);
        
        // Ustaw nieobsługiwane pasma na "Nie" (0)
        if (!compatibleBands.pasmo24GHz) {
          form.setValue(`karty_wifi.${idx}.pasmo.pasmo24GHz`, 0);
        }
        if (!compatibleBands.pasmo5GHz) {
          form.setValue(`karty_wifi.${idx}.pasmo.pasmo5GHz`, 0);
        }
        if (!compatibleBands.pasmo6GHz) {
          form.setValue(`karty_wifi.${idx}.pasmo.pasmo6GHz`, 0);
        }
      }
    });
  }, [wifiFields.map((_, idx) => watch(`karty_wifi.${idx}.wersja.wersja`)), form, wifiFields]);
  // Ustaw wartości formularza przy edycji lub wyczyść po dodaniu
  useEffect(() => {
    if (editingDevice) {
      const resetData = {
        ...editingDevice,
        urzadzenie: {
          ...editingDevice.urzadzenie,
          nazwa_urzadzenia: editingDevice.urzadzenie?.nazwa_urzadzenia ?? '',
          ilosc_portow: editingDevice.urzadzenie?.ilosc_portow ?? editingDevice.porty?.length ?? 1,
        },
        porty: (editingDevice.porty || [{ nazwa: '', status: '', typ: '', predkosc_portu: { predkosc: '' }, polaczenia_portu: [] }]).map((p: any) => ({
          ...p,
          status: p.status || '',
          typ: p.typ || '',
          predkosc_portu: p.predkosc_portu || { predkosc: '' },
          polaczenia_portu: p.polaczenia_portu || [],
        })),
        karty_wifi: (editingDevice.karty_wifi && editingDevice.karty_wifi.length > 0 ? editingDevice.karty_wifi : 
          // Dla Switch nie dodawaj kart WiFi, dla innych typów dodaj jedną pustą kartę jeśli nie ma żadnej
          editingDevice.typ?.typ_u === 'Switch' ? [] : [{
            nazwa: '', 
            status: '',
            pasmo: { pasmo24GHz: 0, pasmo5GHz: 0, pasmo6GHz: 0 },
            wersja: { wersja: '' as any },
            predkosc: { predkosc: 0 },
          }]
        ).map((k: any) => ({
          ...k,
          pasmo: {
            pasmo24GHz: typeof k.pasmo?.pasmo24GHz === 'number' ? k.pasmo.pasmo24GHz : Number(k.pasmo?.pasmo24GHz) || 0,
            pasmo5GHz: typeof k.pasmo?.pasmo5GHz === 'number' ? k.pasmo.pasmo5GHz : Number(k.pasmo?.pasmo5GHz) || 0,
            pasmo6GHz: typeof k.pasmo?.pasmo6GHz === 'number' ? k.pasmo.pasmo6GHz : Number(k.pasmo?.pasmo6GHz) || 0,
          },
          wersja: {
            wersja: k.wersja?.wersja || 'N',
          },
          predkosc: {
            predkosc: typeof k.predkosc?.predkosc === 'number' ? k.predkosc.predkosc : Number(k.predkosc?.predkosc) || 100,
          },
        })),
        typ: { typ_u: editingDevice.typ?.typ_u || '' },
        lokalizacja: editingDevice.lokalizacja || { miejsce: '', szafa: '', rack: '' },
        mac: editingDevice.mac || { MAC: '' },
      };
      reset(resetData);
    } else {
      reset(defaultFormValues);
    }
  }, [editingDevice, reset]);

  // Wyczyść formularz po pomyślnym dodaniu nowego urządzenia
  const [prevSubmitCount, setPrevSubmitCount] = useState(0);
  useEffect(() => {
    // Jeśli formularz został wysłany i nie edytujemy urządzenia, wyczyść go
    if (form.formState.submitCount > prevSubmitCount && !editingDevice && form.formState.isSubmitSuccessful) {
      reset(defaultFormValues);
    }
    setPrevSubmitCount(form.formState.submitCount);
  }, [form.formState.submitCount, form.formState.isSubmitSuccessful, editingDevice, reset, prevSubmitCount]);

  // Sprawdź, czy edytowane urządzenie ma połączenia
  const hasConnections = editingDevice && (
    (editingDevice.porty && editingDevice.porty.some((p: any) => p.polaczenia_portu && p.polaczenia_portu.length > 0)) ||
    (editingDevice.karty_wifi && editingDevice.karty_wifi.some((k: any) => k.polaczenia_karty && k.polaczenia_karty.length > 0))
  );  const handleFormSubmit = (data: DeviceDetailsForm) => {
    onSubmit(data);
  };

  return (
    <StyledDeviceForm onSubmit={handleSubmit(handleFormSubmit)}>
      {editingDevice && hasConnections && (
        <ConnectionWarning>
          Aby edytować to urządzenie, najpierw usuń wszystkie jego połączenia (porty lub karty WiFi).
        </ConnectionWarning>
      )}
      <Fieldset>
        <Legend>Podstawowe dane</Legend>          
        <FormField>
          <Label htmlFor="nazwa_urzadzenia">Nazwa urządzenia:</Label>
          <Input id="nazwa_urzadzenia" placeholder="Wpisz nazwę urządzenia..." {...register('urzadzenie.nazwa_urzadzenia')} />
          {errors.urzadzenie?.nazwa_urzadzenia && <ErrorMsg>{errors.urzadzenie.nazwa_urzadzenia.message}</ErrorMsg>}
        </FormField>          
        <FormField>
          <Label htmlFor="ilosc_portow">Ilość portów:</Label>
          <Input id="ilosc_portow" type="number" min={minPorts} {...register('urzadzenie.ilosc_portow', { valueAsNumber: true })} />
          {errors.urzadzenie?.ilosc_portow && <ErrorMsg>{errors.urzadzenie.ilosc_portow.message}</ErrorMsg>}
        </FormField>
      </Fieldset>
      <Fieldset>
        <Legend>Typ urządzenia</Legend>
        <FormField>            
          <Select id="typ_u" {...register('typ.typ_u')}>
            <option value="">Wybierz typ...</option>
            <option value="PC">PC</option>
            <option value="Router">Router</option>
            <option value="Switch">Switch</option>
            <option value="Access Point">Access Point</option>
          </Select>
          {errors.typ?.typ_u && <ErrorMsg>{errors.typ.typ_u.message}</ErrorMsg>}
        </FormField>
      </Fieldset>         
      <Fieldset>
        <Legend>Lokalizacja</Legend>
        <FormField>
          <Input {...register('lokalizacja.miejsce')} placeholder="Miejsce" />
          {errors.lokalizacja?.miejsce && <ErrorMsg>{errors.lokalizacja.miejsce.message}</ErrorMsg>}
        </FormField>
        <FormField>
          <Input {...register('lokalizacja.szafa')} placeholder="Szafa" />
          {errors.lokalizacja?.szafa && <ErrorMsg>{errors.lokalizacja.szafa.message}</ErrorMsg>}
        </FormField>
        <FormField>
          <Input {...register('lokalizacja.rack')} placeholder="Rack" />
          {errors.lokalizacja?.rack && <ErrorMsg>{errors.lokalizacja.rack.message}</ErrorMsg>}
        </FormField>
      </Fieldset>        
      <Fieldset>
        <Legend>MAC</Legend>
        <FormField>
          <Input {...register('mac.MAC')} placeholder="MAC" />
          {errors.mac?.MAC && <ErrorMsg>{errors.mac.MAC.message}</ErrorMsg>}
        </FormField>
      </Fieldset>
      <Fieldset>
        <Legend>Porty</Legend>          
        {portFields.map((field, idx) => (
          <PortItem
              key={field.id}
              index={idx}
              fieldId={field.id}
              form={form}
              onRemove={removePort}
          />
        ))}
        <AddButton type="button" onClick={() => appendPort({ 
          nazwa: '', 
          status: '', 
          typ: '' as any,
          predkosc_portu: { predkosc: '' as any },
          polaczenia_portu: [] 
        })}>Dodaj port</AddButton>
        </Fieldset>
      {currentDeviceType !== 'Switch' && (
        <Fieldset>
          <Legend>Karty WiFi</Legend>
          {wifiFields.map((field, idx) => {
            return (
              <WifiCardBox
                    key={field.id}
                    index={idx}
                    fieldId={field.id}
                    form={form}
                    onRemove={removeWifi}
                  />
          );
        })}
      {currentDeviceType !== 'Switch' && (
        <AddButton type="button" onClick={() => appendWifi({
          nazwa: '', 
          status: '',
          pasmo: { pasmo24GHz: 0, pasmo5GHz: 0, pasmo6GHz: 0 },
          wersja: { wersja: '' as any },            
          predkosc: { predkosc: 0 },
        })}>Dodaj kartę WiFi</AddButton>
      )}
      </Fieldset>
      )}
      <Button type="submit" disabled={!!(editingDevice && hasConnections)}>{editingDevice ? 'Zapisz zmiany' : 'Dodaj urządzenie'}</Button>
      {editingDevice && (
        <CancelEditButton type="button" onClick={onCancelEdit}>
          Anuluj edycję
        </CancelEditButton>
      )}
    </StyledDeviceForm>
  );
};
