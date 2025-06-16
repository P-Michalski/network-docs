import { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDevices } from '../../hooks/useDevices';
import { useFormSync } from '../../hooks/useFormSync';
import { createDeviceDetailsSchema, type DeviceDetailsForm, defaultFormValues } from './formSchemas/addDeviceFormSchema';
import { FormField, Label, Input, ErrorMsg, Select, Fieldset, MainContainer, DeviceForm, WifiCardBox, WifiCardInnerRow, WifiPasmoFieldset, WifiStandardFieldset, SidePanel, DeviceListItem, EditButton, DeleteButton, CancelEditButton, SidePanelHeader, SidePanelList, Button, AddButton, RemoveButton, Legend, DeviceTypeSpan } from '../components/DeviceForm/StyledFormComponents';
import { DeviceDetails } from '../../Models/DeviceDetails.class';


const AddDevicePage = () => {
  const { devices: deviceList, addDevice, updateDevice, deleteDevice } = useDevices();
  const [editingDevice, setEditingDevice] = useState<any | null>(null);
  
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
  
  // Get the current values for default values
  const currentWifiValues = watch('karty_wifi') || [];
    // Użyj hooków do synchronizacji pól
  const { fields: portFields, append: appendPort, remove: removePort } = useFormSync(form, 'urzadzenie.ilosc_portow', 'porty', { 
    nazwa: '', 
    status: '',    typ: '' as any,
    predkosc_portu: { predkosc: '1Gb/s' as const },
    polaczenia_portu: [] 
  });
  const { fields: wifiFields, append: appendWifi, remove: removeWifi } = useFieldArray({ control: form.control, name: 'karty_wifi' });
  // After adding a device, reload the list
  const onSubmit = (data: DeviceDetailsForm) => {
    try {      
      // Upewnij się, że mappedData.urzadzenie.nazwa_urzadzenia NIE jest null/undefined
      const mappedData = {
        ...data,
        urzadzenie: {
          ...data.urzadzenie,
          nazwa_urzadzenia: String(data.urzadzenie.nazwa_urzadzenia ?? ''),
          ilosc_portow: Number(data.urzadzenie.ilosc_portow ?? (data.porty?.length ?? 1)),
        },
        typ: {
          id_typu: editingDevice?.typ?.id_typu ?? 0,
          id_u: editingDevice?.urzadzenie?.id_u ?? 1,
          typ_u: data.typ.typ_u,
        },
      };
      
      // DEBUG: sprawdź co wysyłasz do backendu
      console.log('=== DEBUG ONSUBMIT ===');
      console.log('originalData from form:', data);
      console.log('mappedData:', mappedData);
      console.log('editingDevice:', editingDevice);
      console.log('isEditing:', !!editingDevice);
      console.log('mappedData.urzadzenie.nazwa_urzadzenia type:', typeof mappedData.urzadzenie.nazwa_urzadzenia);
      console.log('mappedData.urzadzenie.nazwa_urzadzenia value:', mappedData.urzadzenie.nazwa_urzadzenia);
      console.log('mappedData.urzadzenie.ilosc_portow type:', typeof mappedData.urzadzenie.ilosc_portow);
      console.log('mappedData.urzadzenie.ilosc_portow value:', mappedData.urzadzenie.ilosc_portow);
      console.log('========================');
      if (editingDevice) {
        const deviceInstance = DeviceDetails.fromApi(mappedData);
        updateDevice(editingDevice.urzadzenie.id_u, deviceInstance);
        setEditingDevice(null);
        reset(defaultFormValues); // czyść do domyślnych wartości
      } else {
        console.log('Dodaję nowe urządzenie...');
        addDevice(mappedData);
        reset(defaultFormValues);
      }
    } catch (err) {
      console.error('Błąd w onSubmit:', err);
      alert('Błąd podczas zapisu urządzenia');
    }
  };
  const handleEdit = (dev: any) => {
    // Upewnij się, że zawsze są wartości domyślne dla nazwa_urzadzenia i ilosc_portow
    setEditingDevice(dev);
    reset({
      ...dev,      urzadzenie: {
        ...dev.urzadzenie,
        nazwa_urzadzenia: dev.urzadzenie?.nazwa_urzadzenia ?? '',
        ilosc_portow: dev.urzadzenie?.ilosc_portow ?? dev.porty?.length ?? 1,
      },      porty: (dev.porty || [{ nazwa: '', status: '', typ: '', predkosc_portu: { predkosc: '' }, polaczenia_portu: [] }]).map((p: any) => ({
        ...p,
        status: p.status || '',
        typ: p.typ || '',
        predkosc_portu: p.predkosc_portu || { predkosc: '' },
        polaczenia_portu: p.polaczenia_portu || [],
      })),
      karty_wifi: (dev.karty_wifi || [defaultFormValues.karty_wifi[0]]).map((k: any) => ({
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
      typ: { typ_u: dev.typ?.typ_u || '' },
      lokalizacja: dev.lokalizacja || { miejsce: '', szafa: '', rack: '' },
      mac: dev.mac || { MAC: '' },
    });
  };

  // Sprawdź, czy edytowane urządzenie ma połączenia
  const hasConnections = editingDevice && (
    (editingDevice.porty && editingDevice.porty.some((p: any) => p.polaczenia_portu && p.polaczenia_portu.length > 0)) ||
    (editingDevice.karty_wifi && editingDevice.karty_wifi.some((k: any) => k.polaczenia_karty && k.polaczenia_karty.length > 0))
  );

  return (
    <MainContainer>
      <DeviceForm onSubmit={handleSubmit(onSubmit)}>
        {editingDevice && hasConnections && (
          <div style={{ color: 'red', fontWeight: 'bold', marginBottom: 16 }}>
            Aby edytować to urządzenie, najpierw usuń wszystkie jego połączenia (porty lub karty WiFi).
          </div>
        )}
        <Fieldset>
          <Legend>Podstawowe dane</Legend>          <FormField>
            <Label htmlFor="nazwa_urzadzenia">Nazwa urządzenia:</Label>
            <Input id="nazwa_urzadzenia" {...register('urzadzenie.nazwa_urzadzenia')} />
            {errors.urzadzenie?.nazwa_urzadzenia && <ErrorMsg>{errors.urzadzenie.nazwa_urzadzenia.message}</ErrorMsg>}
          </FormField>
          <FormField>
            <Label htmlFor="ilosc_portow">Ilość portów:</Label>
            <Input id="ilosc_portow" type="number" min={1} {...register('urzadzenie.ilosc_portow', { valueAsNumber: true })} />
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
        </Fieldset>        <Fieldset>
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
        </Fieldset>        <Fieldset>
          <Legend>MAC</Legend>
          <FormField>
            <Input {...register('mac.MAC')} placeholder="MAC" />
            {errors.mac?.MAC && <ErrorMsg>{errors.mac.MAC.message}</ErrorMsg>}
          </FormField>
        </Fieldset>
        <Fieldset>
          <Legend>Porty</Legend>          {portFields.map((field, idx) => (
            <FormField key={field.id}>
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
              </Select>
              {errors.porty?.[idx]?.predkosc_portu?.predkosc && <ErrorMsg>{errors.porty[idx]?.predkosc_portu?.predkosc?.message}</ErrorMsg>}
              
              <RemoveButton type="button" onClick={() => removePort(idx)}>Usuń port</RemoveButton>
            </FormField>
          ))}          <AddButton type="button" onClick={() => appendPort({ 
            nazwa: '', 
            status: '', 
            typ: '' as any,
            predkosc_portu: { predkosc: '' as any },
            polaczenia_portu: [] 
          })}>Dodaj port</AddButton>
        </Fieldset>
        <Fieldset>
          <Legend>Karty WiFi</Legend>
          {wifiFields.map((field, idx) => (
            <WifiCardBox key={field.id}>              <FormField>
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
              <WifiCardInnerRow>                <WifiPasmoFieldset>
                  <Legend>Pasmo</Legend>
                  <FormField>
                    <Label>2.4GHz:</Label>
                    <Select
                      {...register(`karty_wifi.${idx}.pasmo.pasmo24GHz`, { setValueAs: v => Number(v) })}
                      defaultValue={currentWifiValues[idx]?.pasmo?.pasmo24GHz === 1 ? '1' : '0'}
                    >
                      <option value="1">Tak</option>
                      <option value="0">Nie</option>
                    </Select>
                  </FormField>                  <FormField>
                    <Label>5GHz:</Label>
                    <Select
                      {...register(`karty_wifi.${idx}.pasmo.pasmo5GHz`, { setValueAs: v => Number(v) })}
                      defaultValue={currentWifiValues[idx]?.pasmo?.pasmo5GHz === 1 ? '1' : '0'}
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
                    >
                      <option value="1">Tak</option>
                      <option value="0">Nie</option>
                    </Select>
                  </FormField>                  {errors.karty_wifi?.[idx]?.pasmo && <ErrorMsg>{errors.karty_wifi[idx]?.pasmo?.message}</ErrorMsg>}
                </WifiPasmoFieldset>                <WifiStandardFieldset>
                  <Legend>Wersja WiFi</Legend>
                  <FormField>
                    <Label>Wersja:</Label>                    <Select {...register(`karty_wifi.${idx}.wersja.wersja`)}>
                      <option value="">Wybierz wersję...</option>
                      <option value="B">B</option>
                      <option value="G">G</option>
                      <option value="N">N</option>
                      <option value="AC">AC</option>
                      <option value="AX">AX</option>
                      <option value="BE">BE</option>
                    </Select>
                  </FormField>                  {errors.karty_wifi?.[idx]?.wersja?.wersja && <ErrorMsg>{errors.karty_wifi[idx]?.wersja?.wersja?.message}</ErrorMsg>}
                </WifiStandardFieldset>                <WifiStandardFieldset>
                  <Legend>Prędkość</Legend>
                  <FormField>
                    <Label>Prędkość (Mb/s):</Label>
                    <Input 
                      type="number" 
                      placeholder="Prędkość w Mb/s"
                      {...register(`karty_wifi.${idx}.predkosc.predkosc`, { setValueAs: v => Number(v) })}
                    />
                  </FormField>                  {errors.karty_wifi?.[idx]?.predkosc?.predkosc && <ErrorMsg>{errors.karty_wifi[idx]?.predkosc?.predkosc?.message}</ErrorMsg>}
                </WifiStandardFieldset>
              </WifiCardInnerRow>
              <RemoveButton type="button" onClick={() => removeWifi(idx)}>Usuń kartę WiFi</RemoveButton>
            </WifiCardBox>
          ))}          <AddButton type="button" onClick={() => appendWifi({
            nazwa: '', 
            status: '',
            pasmo: { pasmo24GHz: 0, pasmo5GHz: 0, pasmo6GHz: 0 },
            wersja: { wersja: '' as any },
            predkosc: { predkosc: 0 },
          })}>Dodaj kartę WiFi</AddButton>
        </Fieldset>
        <Button type="submit" disabled={!!(editingDevice && hasConnections)}>{editingDevice ? 'Zapisz zmiany' : 'Dodaj urządzenie'}</Button>
        {editingDevice && (
          <CancelEditButton type="button" onClick={() => { setEditingDevice(null); reset(defaultFormValues); }}>
            Anuluj edycję
          </CancelEditButton>
        )}
      </DeviceForm>
      <SidePanel>
        <SidePanelHeader>Lista urządzeń</SidePanelHeader>
        <SidePanelList>
          {deviceList.map((dev: any) => {
            const deviceName = dev.urzadzenie?.nazwa_urzadzenia || '-';
            const deviceType = dev.typ?.typ_u || '-';
            return (
              <DeviceListItem key={dev.urzadzenie?.id_u}>
                <span>
                  {deviceName} <DeviceTypeSpan>{deviceType}</DeviceTypeSpan>
                </span>
                <span>
                  <EditButton type="button" onClick={() => handleEdit(dev)}>Edit</EditButton>                  <DeleteButton type="button" onClick={() => {
                    if (window.confirm('Czy na pewno chcesz usunąć to urządzenie?')) {
                      deleteDevice(dev.urzadzenie?.id_u);
                    }
                  }}>Usuń</DeleteButton>
                </span>
              </DeviceListItem>
            );
          })}
        </SidePanelList>
      </SidePanel>
    </MainContainer>
  );
};

export default AddDevicePage;