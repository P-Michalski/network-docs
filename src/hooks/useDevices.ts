import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState } from '../store';
import { fetchDevicesRequest, addDeviceRequest, updateDeviceRequest, deleteDeviceRequest } from '../Update/Slices/devicesSlice';
import type { DeviceDetails } from '../Models/Interfaces/IDeviceDetails';

export const useDevices = () => {
  const dispatch = useDispatch();
  const { devices, loading, error } = useSelector((state: RootState) => state.devices);

  const fetchDevices = () => {
    dispatch(fetchDevicesRequest());
  };

  const updateDevice = (id: number, device: DeviceDetails) => {
    dispatch(updateDeviceRequest({ id_u: id, device }));
  };

  const deleteDevice = (id: number) => {
    dispatch(deleteDeviceRequest(id));
  };

  const addDevice = (device: any) => {
    dispatch(addDeviceRequest(device));
  };

  useEffect(() => {
    if (devices.length === 0) {
      fetchDevices();
    }
  }, []);

  return {
    devices,
    loading,
    error,
    fetchDevices,
    updateDevice,
    deleteDevice,
    addDevice
  };
};