import { useState } from 'react';
import { useDevices } from '../../hooks/useDevices';
import { useDeviceFiltering } from '../../hooks/useDeviceFiltering';
import { PageContainer } from '../components/DeviceListPage/styled';
import { DeviceListPanel } from '../components/DeviceListPage/DeviceListPanel';
import { DeviceDetailsPanel } from '../components/DeviceListPage/DeviceDetailsPanel';
import LoadingComponent from '../components/Loading';
import DatabaseErrorComponent from '../components/Error';

const DeviceListPage = () => {
  const { devices, loading, error, fetchDevices } = useDevices();
  const { activeTab, setActiveTab, deviceTypes, filteredDevices, getTabLabel } = useDeviceFiltering(devices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  
  const selectedDevice = devices.find(d => d.urzadzenie.id_u === selectedDeviceId);
  
  if (loading) {
    return <LoadingComponent message="Ładowanie urządzeń..." subtext="Pobieranie listy urządzeń z bazy danych." />;
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
    <PageContainer>
      <DeviceListPanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceTypes={deviceTypes}
        getTabLabel={getTabLabel}
        filteredDevices={filteredDevices}
        selectedDeviceId={selectedDeviceId}
        setSelectedDeviceId={setSelectedDeviceId}
      />
      <DeviceDetailsPanel
        selectedDevice={selectedDevice}
      />
    </PageContainer>
  );
};

export default DeviceListPage;