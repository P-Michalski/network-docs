import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchDevicesRequest, deleteDeviceRequest, updateDeviceRequest } from '../../Update/Slices/devicesSlice';
import { FormField, Label, Input, ErrorMsg, Select } from '../components/DeviceForm/StyledFormComponents';

const deviceDetailsSchema = z.object({
  urzadzenie: z.object({
    nazwa_urzadzenia: z.string().min(1, 'Podaj nazwę urządzenia'),
    ilosc_portow: z.coerce.number().int().min(1, 'Musi mieć przynajmniej 1 port'),
  }),
  typ: z.object({
    typ_u: z.string().min(1, 'Podaj typ urządzenia'),
  }),
  lokalizacja: z.object({
    miejsce: z.string().min(1, 'Podaj miejsce'),
    szafa: z.string().min(1, 'Podaj szafę'),
    rack: z.string().min(1, 'Podaj rack'),
  }),
  mac: z.object({
    MAC: z.string().min(1, 'Podaj adres MAC'),
  }),
  porty: z.array(z.object({
    nazwa: z.string().min(1, 'Podaj nazwę portu'),
    status: z.string().min(1, 'Podaj status'),
    polaczenia_portu: z.array(z.object({
      id_p: z.number().optional(),
      id_u: z.number().optional(),
      nazwa: z.string().min(1, 'Podaj nazwę połączenia portu'),
      status: z.string().min(1, 'Podaj status połączenia portu'),
    })),
  })),
  karty_wifi: z.array(z.object({
    nazwa: z.string().min(1, 'Podaj nazwę karty'),
    status: z.string().min(1, 'Podaj status'),
    pasmo: z.object({
      pasmo24GHz: z.coerce.number(),
      pasmo5GHz: z.coerce.number(),
    }),
    wersja: z.object({
      WIFI4: z.coerce.number(),
      WIFI5: z.coerce.number(),
      WIFI6: z.coerce.number(),
    }),
    predkosc: z.object({
      '200Mb': z.coerce.number(),
      '800Mb': z.coerce.number(),
      '2Gb': z.coerce.number(),
    }),
  })),
});

type DeviceDetailsForm = z.infer<typeof deviceDetailsSchema>;

const defaultFormValues: DeviceDetailsForm = {
  porty: [{ nazwa: '', status: '', polaczenia_portu: [] }],
  karty_wifi: [{
    nazwa: '', status: '',
    pasmo: { pasmo24GHz: 0, pasmo5GHz: 0 },
    wersja: { WIFI4: 0, WIFI5: 0, WIFI6: 0 },
    predkosc: { '200Mb': 0, '800Mb': 0, '2Gb': 0 },
  }],
  urzadzenie: { nazwa_urzadzenia: '', ilosc_portow: 1 },
  typ: { typ_u: '' },
  lokalizacja: { miejsce: '', szafa: '', rack: '' },
  mac: { MAC: '' },
};

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
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1, marginBottom: 32, maxWidth: 600 }}>
        <fieldset>
          <legend>Podstawowe dane</legend>
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
        </fieldset>
        <fieldset>
          <legend>Typ urządzenia</legend>
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
        </fieldset>
        <fieldset>
          <legend>Lokalizacja</legend>
          <FormField>
            <Input {...register('lokalizacja.miejsce')} placeholder="Miejsce" />
          </FormField>
          <FormField>
            <Input {...register('lokalizacja.szafa')} placeholder="Szafa" />
          </FormField>
          <FormField>
            <Input {...register('lokalizacja.rack')} placeholder="Rack" />
          </FormField>
        </fieldset>
        <fieldset>
          <legend>MAC</legend>
          <FormField>
            <Input {...register('mac.MAC')} placeholder="MAC" />
          </FormField>
        </fieldset>
        <fieldset>
          <legend>Porty</legend>
          {portFields.map((field, idx) => (
            <FormField key={field.id}>
              <Input {...register(`porty.${idx}.nazwa`)} placeholder="Nazwa portu" />
              <Select {...register(`porty.${idx}.status`)}>
                <option value="">Wybierz status...</option>
                <option value="aktywny">Aktywny</option>
                <option value="nieaktywny">Nieaktywny</option>
              </Select>
              <button type="button" onClick={() => removePort(idx)}>-</button>
            </FormField>
          ))}
          <button type="button" onClick={() => appendPort({ nazwa: '', status: '', polaczenia_portu: [] })}>Dodaj port</button>
        </fieldset>
        <fieldset>
          <legend>Karty WiFi</legend>
          {wifiFields.map((field, idx) => (
            <div key={field.id} style={{ marginBottom: 16, border: '1px solid #eee', padding: 8 }}>
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
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
                <fieldset style={{ minWidth: 180, padding: 8 }}>
                  <legend>Pasmo</legend>
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
                </fieldset>
                <fieldset style={{ minWidth: 180, padding: 8 }}>
                  <legend>Wersja WiFi</legend>
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
                </fieldset>
                <fieldset style={{ minWidth: 180, padding: 8 }}>
                  <legend>Prędkość</legend>
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
                </fieldset>
              </div>
              <button type="button" onClick={() => removeWifi(idx)}>-</button>
            </div>
          ))}
          <button type="button" onClick={() => appendWifi({
            nazwa: '', status: '',
            pasmo: { pasmo24GHz: 0, pasmo5GHz: 0 },
            wersja: { WIFI4: 0, WIFI5: 0, WIFI6: 0 },
            predkosc: { '200Mb': 0, '800Mb': 0, '2Gb': 0 },
          })}>Dodaj kartę WiFi</button>
        </fieldset>
        <button type="submit">{editingDevice ? 'Zapisz zmiany' : 'Dodaj urządzenie'}</button>
        {editingDevice && (
          <button type="button" style={{ marginLeft: 12 }} onClick={() => { setEditingDevice(null); reset(defaultFormValues); }}>
            Anuluj edycję
          </button>
        )}
      </form>
      <aside style={{ minWidth: 320, maxWidth: 400, background: '#fafbfc', border: '1px solid #eee', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px #0001' }}>
        <h3 style={{ marginTop: 0 }}>Lista urządzeń</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {deviceList.map((dev: any) => {
            const deviceName = dev.urzadzenie?.nazwa_urzadzenia || '-';
            const deviceType = dev.typ?.typ_u || '-';
            return (
              <li key={dev.urzadzenie?.id_u} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                <span>
                  {deviceName} ({deviceType})
                </span>
                <span>
                  <button type="button" style={{ marginRight: 8 }} onClick={() => handleEdit(dev)}>Edit</button>
                  <button type="button" style={{ color: '#d32f2f' }} onClick={() => {
                    if (window.confirm('Czy na pewno chcesz usunąć to urządzenie?')) {
                      dispatch(deleteDeviceRequest(dev.urzadzenie?.id_u));
                    }
                  }}>Usuń</button>
                </span>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default AddDevicePage;