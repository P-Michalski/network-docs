import { useState } from 'react';
import { useDevices } from '../../hooks/useDevices';
import { type DeviceDetailsForm } from './formSchemas/addDeviceFormSchema';
import { MainContainer } from '../components/DeviceForm/styled';
import { DeviceDetails } from '../../Models/Classes/DeviceDetails.class';
import LoadingComponent from '../components/Loading/LoadingComponent';
import DatabaseErrorComponent from '../components/Error/DatabaseErrorComponent';
import { SidePanel } from '../components/DeviceForm/SidePanel';
import { DeviceForm } from '../components/DeviceForm';


const AddDevicePage = () => {
  const { devices: deviceList, addDevice, updateDevice, deleteDevice, loading, error, fetchDevices } = useDevices();
  const [editingDevice, setEditingDevice] = useState<any | null>(null);
  
  const onSubmit = (data: DeviceDetailsForm) => {
    try {      
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
        // Dla urządzeń typu Switch, usuń karty WiFi
        karty_wifi: data.typ.typ_u === 'Switch' ? [] : (data.karty_wifi || []),
      };
      
      if (editingDevice) {
        const deviceInstance = DeviceDetails.fromApi(mappedData);
        updateDevice(editingDevice.urzadzenie.id_u, deviceInstance);
        setEditingDevice(null);
      } else {
        console.log('Dodaję nowe urządzenie...');
        addDevice(mappedData);
      }
    } catch (err) {
      console.error('Błąd w onSubmit:', err);
      alert('Błąd podczas zapisu urządzenia');
    }
  };

  const handleEdit = (dev: any) => {
    setEditingDevice(dev);
  };  const handleCancelEdit = () => {
    setEditingDevice(null);
  };


  if (loading && deviceList.length === 0) {
    return <LoadingComponent message="Ładowanie urządzeń..." subtext="Przygotowywanie formularza dodawania urządzeń." />;
  }
  
  if (error) {
    return (
      <DatabaseErrorComponent 
        error={error} 
        onRetry={fetchDevices}
        showTechnicalDetails={true}
      />
    );
  }

  return (
    <MainContainer>      
      <DeviceForm 
        deviceList={deviceList}
        editingDevice={editingDevice}
        onSubmit={onSubmit}
        onCancelEdit={handleCancelEdit}
      />
      <SidePanel 
        deviceList={deviceList}
        onEdit={handleEdit}
        onDelete={deleteDevice}
      />
    </MainContainer>
  );
};

export default AddDevicePage;