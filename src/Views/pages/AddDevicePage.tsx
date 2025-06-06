import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector, useDispatch } from 'react-redux';
import { deviceDetailsSchema, type DeviceDetailsForm, defaultFormValues } from './formSchemas/addDeviceFormSchema';
import type { RootState } from '../../store';
import { fetchDevicesRequest, deleteDeviceRequest, updateDeviceRequest } from '../../Update/Slices/devicesSlice';
import { FormField, Label, Input, ErrorMsg, Select, Fieldset, MainContainer, DeviceForm, WifiCardBox, WifiCardInnerRow, SidePanel, DeviceListItem, EditButton, DeleteButton, CancelEditButton, SidePanelHeader, SidePanelList, Button, AddButton, RemoveButton, Legend, DeviceTypeSpan } from '../components/DeviceForm/StyledFormComponents';


const AddDevicePage = () => {
  const dispatch = useDispatch();
  const deviceList = useSelector((state: RootState) => state.devices.devices);
  const [editingDevice, setEditingDevice] = useState<any | null>(null);
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm<DeviceDetailsForm>({
    resolver: zodResolver(deviceDetailsSchema),
    defaultValues: defaultFormValues,
  });
  const { fields: portFields, append: appendPort, remove: removePort } = useFieldArray({ control, name: 'porty' });
  const { fields: wifiFields, append: appendWifi, remove: removeWifi } = useFieldArray({ control, name: 'karty_wifi' });

  // Fetch all devices for the side panel
  useEffect(() => {
    dispatch(fetchDevicesRequest());
  }, [dispatch]);

  // Synchronize port count <-> port fields
  const ilosc_portow = watch('urzadzenie.ilosc_portow');
  useEffect(() => {
    if (typeof ilosc_portow === 'number' && ilosc_portow > 0) {
      const diff = ilosc_portow - portFields.length;
      if (diff > 0) {
        // Add missing ports
        for (let i = 0; i < diff; i++) {
          appendPort({ nazwa: '', status: '', polaczenia_portu: [] });
        }
      } else if (diff < 0) {
        // Remove extra ports
        for (let i = 0; i < -diff; i++) {
          removePort(portFields.length - 1 - i);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ilosc_portow]);

  // When ports are added/removed, update ilosc_portow
  useEffect(() => {
    setValue('urzadzenie.ilosc_portow', portFields.length as any, { shouldValidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portFields.length]);

  // After adding a device, reload the list
  const onSubmit = (data: DeviceDetailsForm) => {
    try {
      const mappedData = JSON.parse(JSON.stringify({
        ...data,
        typ: {
          id_typu: 0,
          id_u: 1,
          typ_u: data.typ.typ_u,
        },
      }));
      if (editingDevice) {
        dispatch(updateDeviceRequest({ id_u: editingDevice.urzadzenie.id_u, device: mappedData }));
        setEditingDevice(null);
        reset(defaultFormValues); // czyść do domyślnych wartości
      } else {
        dispatch({ type: 'devices/addDeviceRequest', payload: mappedData });
        reset(defaultFormValues);
      }
    } catch (err) {
      alert('Błąd podczas zapisu urządzenia');
    }
  };

  const handleEdit = (dev: any) => {
    setEditingDevice(dev);
    reset({
      ...dev,
      urzadzenie: {
        ...dev.urzadzenie,
        ilosc_portow: dev.urzadzenie?.ilosc_portow || dev.porty?.length || 1,
      },
      porty: (dev.porty || [{ nazwa: '', status: '', polaczenia_portu: [] }]).map((p: any) => ({
        ...p,
        status: p.status || '',
        polaczenia_portu: p.polaczenia_portu || [],
      })),
      karty_wifi: (dev.karty_wifi || [defaultFormValues.karty_wifi[0]]).map((k: any) => ({
        ...k,
        pasmo: {
          pasmo24GHz: typeof k.pasmo?.pasmo24GHz === 'number' ? k.pasmo.pasmo24GHz : Number(k.pasmo?.pasmo24GHz) || 0,
          pasmo5GHz: typeof k.pasmo?.pasmo5GHz === 'number' ? k.pasmo.pasmo5GHz : Number(k.pasmo?.pasmo5GHz) || 0,
        },
        wersja: {
          WIFI4: typeof k.wersja?.WIFI4 === 'number' ? k.wersja.WIFI4 : Number(k.wersja?.WIFI4) || 0,
          WIFI5: typeof k.wersja?.WIFI5 === 'number' ? k.wersja.WIFI5 : Number(k.wersja?.WIFI5) || 0,
          WIFI6: typeof k.wersja?.WIFI6 === 'number' ? k.wersja.WIFI6 : Number(k.wersja?.WIFI6) || 0,
        },
        predkosc: {
          '200Mb': typeof k.predkosc?.['200Mb'] === 'number' ? k.predkosc['200Mb'] : Number(k.predkosc?.['200Mb']) || 0,
          '800Mb': typeof k.predkosc?.['800Mb'] === 'number' ? k.predkosc['800Mb'] : Number(k.predkosc?.['800Mb']) || 0,
          '2Gb': typeof k.predkosc?.['2Gb'] === 'number' ? k.predkosc['2Gb'] : Number(k.predkosc?.['2Gb']) || 0,
        },
      })),
      typ: { typ_u: dev.typ?.typ_u || '' },
      lokalizacja: dev.lokalizacja || { miejsce: '', szafa: '', rack: '' },
      mac: dev.mac || { MAC: '' },
    });
  };

  return (
    <MainContainer>
      <DeviceForm onSubmit={handleSubmit(onSubmit)}>
        <Fieldset>
          <Legend>Podstawowe dane</Legend>
          <FormField>
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
        </Fieldset>
        <Fieldset>
          <Legend>Lokalizacja</Legend>
          <FormField>
            <Input {...register('lokalizacja.miejsce')} placeholder="Miejsce" />
          </FormField>
          <FormField>
            <Input {...register('lokalizacja.szafa')} placeholder="Szafa" />
          </FormField>
          <FormField>
            <Input {...register('lokalizacja.rack')} placeholder="Rack" />
          </FormField>
        </Fieldset>
        <Fieldset>
          <Legend>MAC</Legend>
          <FormField>
            <Input {...register('mac.MAC')} placeholder="MAC" />
          </FormField>
        </Fieldset>
        <Fieldset>
          <Legend>Porty</Legend>
          {portFields.map((field, idx) => (
            <FormField key={field.id}>
              <Input {...register(`porty.${idx}.nazwa`)} placeholder="Nazwa portu" />
              <Select {...register(`porty.${idx}.status`)}>
                <option value="">Wybierz status...</option>
                <option value="aktywny">Aktywny</option>
                <option value="nieaktywny">Nieaktywny</option>
              </Select>
              <RemoveButton type="button" onClick={() => removePort(idx)}>Usuń port</RemoveButton>
            </FormField>
          ))}
          <AddButton type="button" onClick={() => appendPort({ nazwa: '', status: '', polaczenia_portu: [] })}>Dodaj port</AddButton>
        </Fieldset>
        <Fieldset>
          <Legend>Karty WiFi</Legend>
          {wifiFields.map((field, idx) => (
            <WifiCardBox key={field.id}>
              <FormField>
                <Label>Nazwa karty:</Label>
                <Input {...register(`karty_wifi.${idx}.nazwa`)} placeholder="Nazwa karty WiFi" />
                <Label>Status:</Label>
                <Select {...register(`karty_wifi.${idx}.status`)}>
                  <option value="">Wybierz status...</option>
                  <option value="aktywny">Aktywny</option>
                  <option value="nieaktywny">Nieaktywny</option>
                </Select>
              </FormField>
              <WifiCardInnerRow>
                <Fieldset>
                  <Legend>Pasmo</Legend>
                  <FormField>
                    <Label>2.4GHz:</Label>
                    <Select
                      {...register(`karty_wifi.${idx}.pasmo.pasmo24GHz`, { setValueAs: v => Number(v) })}
                      defaultValue={wifiFields[idx]?.pasmo?.pasmo24GHz === 1 ? '1' : '0'}
                    >
                      <option value="1">Tak</option>
                      <option value="0">Nie</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>5GHz:</Label>
                    <Select
                      {...register(`karty_wifi.${idx}.pasmo.pasmo5GHz`, { setValueAs: v => Number(v) })}
                      defaultValue={wifiFields[idx]?.pasmo?.pasmo5GHz === 1 ? '1' : '0'}
                    >
                      <option value="1">Tak</option>
                      <option value="0">Nie</option>
                    </Select>
                  </FormField>
                </Fieldset>
                <Fieldset>
                  <Legend>Wersja WiFi</Legend>
                  <FormField>
                    <Label>WIFI4:</Label>
                    <Select
                      {...register(`karty_wifi.${idx}.wersja.WIFI4`, { setValueAs: v => Number(v) })}
                      defaultValue={wifiFields[idx]?.wersja?.WIFI4 === 1 ? '1' : '0'}
                    >
                      <option value="1">Tak</option>
                      <option value="0">Nie</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>WIFI5:</Label>
                    <Select
                      {...register(`karty_wifi.${idx}.wersja.WIFI5`, { setValueAs: v => Number(v) })}
                      defaultValue={wifiFields[idx]?.wersja?.WIFI5 === 1 ? '1' : '0'}
                    >
                      <option value="1">Tak</option>
                      <option value="0">Nie</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>WIFI6:</Label>
                    <Select
                      {...register(`karty_wifi.${idx}.wersja.WIFI6`, { setValueAs: v => Number(v) })}
                      defaultValue={wifiFields[idx]?.wersja?.WIFI6 === 1 ? '1' : '0'}
                    >
                      <option value="1">Tak</option>
                      <option value="0">Nie</option>
                    </Select>
                  </FormField>
                </Fieldset>
                <Fieldset>
                  <Legend>Prędkość</Legend>
                  <FormField>
                    <Label>200Mb:</Label>
                    <Select
                      {...register(`karty_wifi.${idx}.predkosc.200Mb`, { setValueAs: v => Number(v) })}
                      defaultValue={wifiFields[idx]?.predkosc?.['200Mb'] === 1 ? '1' : '0'}
                    >
                      <option value="1">Tak</option>
                      <option value="0">Nie</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>800Mb:</Label>
                    <Select
                      {...register(`karty_wifi.${idx}.predkosc.800Mb`, { setValueAs: v => Number(v) })}
                      defaultValue={wifiFields[idx]?.predkosc?.['800Mb'] === 1 ? '1' : '0'}
                    >
                      <option value="1">Tak</option>
                      <option value="0">Nie</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>2Gb:</Label>
                    <Select
                      {...register(`karty_wifi.${idx}.predkosc.2Gb`, { setValueAs: v => Number(v) })}
                      defaultValue={wifiFields[idx]?.predkosc?.['2Gb'] === 1 ? '1' : '0'}
                    >
                      <option value="1">Tak</option>
                      <option value="0">Nie</option>
                    </Select>
                  </FormField>
                </Fieldset>
              </WifiCardInnerRow>
              <RemoveButton type="button" onClick={() => removeWifi(idx)}>Usuń kartę WiFi</RemoveButton>
            </WifiCardBox>
          ))}
          <AddButton type="button" onClick={() => appendWifi({
            nazwa: '', status: '',
            pasmo: { pasmo24GHz: 0, pasmo5GHz: 0 },
            wersja: { WIFI4: 0, WIFI5: 0, WIFI6: 0 },
            predkosc: { '200Mb': 0, '800Mb': 0, '2Gb': 0 },
          })}>Dodaj kartę WiFi</AddButton>
        </Fieldset>
        <Button type="submit">{editingDevice ? 'Zapisz zmiany' : 'Dodaj urządzenie'}</Button>
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
                  <EditButton type="button" onClick={() => handleEdit(dev)}>Edit</EditButton>
                  <DeleteButton type="button" onClick={() => {
                    if (window.confirm('Czy na pewno chcesz usunąć to urządzenie?')) {
                      dispatch(deleteDeviceRequest(dev.urzadzenie?.id_u));
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