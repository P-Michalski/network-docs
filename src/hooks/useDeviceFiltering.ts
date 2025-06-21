import { useMemo, useState } from 'react';
import type { DeviceDetails } from '../Models/Interfaces/IDeviceDetails';

export const useDeviceFiltering = (devices: DeviceDetails[]) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const deviceTypes = useMemo(() => {
    const types = [...new Set(devices.map(device => device.typ.typ_u))];
    return types; // Remove 'all' from here as it will be handled separately
  }, [devices]);

  const filteredDevices = useMemo(() => {
    if (activeTab === 'all') return devices;
    return devices.filter(device => device.typ.typ_u === activeTab);
  }, [devices, activeTab]);

  const getTabLabel = (tab: string) => {
    if (tab === 'all') return 'Wszystkie';
    return tab;
  };

  return {
    activeTab,
    setActiveTab,
    deviceTypes,
    filteredDevices,
    getTabLabel
  };
};