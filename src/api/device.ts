import api from './axios';
import type { Device } from '../Models/Device';
import type { DeviceDetails } from '../Models/DeviceDetails';

export const fetchDevicesDetails = async (): Promise<DeviceDetails[]> => {
  const response = await api.get<DeviceDetails[]>('/urzadzenia/all-details');
  return response.data;
};

export const fetchDevice = async (id: number): Promise<Device> => {
  const response = await api.get<Device>(`/urzadzenia/${id}`);
  return response.data;
};

export const fetchDevices = async (): Promise<Device[]> => {
  const response = await api.get<Device[]>(`/urzadzenia`);
  return response.data;
};

export const fetchDeviceDetails = async (id: number): Promise<DeviceDetails> => {
  const response = await api.get<DeviceDetails>(`/urzadzenia/${id}/all`);
  return response.data;
};

export const addDevice = async (device: Omit<DeviceDetails, 'urzadzenie' | 'typ' | 'porty' | 'karty_wifi' | 'mac' | 'lokalizacja'> & DeviceDetails): Promise<void> => {
  console.log('API: addDevice wywołana');
  console.log('API: device:', device);
  console.log('API: JSON.stringify(device):', JSON.stringify(device, null, 2));
  
  const response = await api.post('/urzadzenia/full', device);
  console.log('API: addDevice response:', response);
};

export const deleteDevice = async (id: number): Promise<void> => {
  await api.delete(`/urzadzenia/${id}`);
};

export const updateDevice = async (id: number, device: DeviceDetails): Promise<void> => {
  console.log('API: updateDevice wywołana');
  console.log('API: id:', id);
  console.log('API: device:', device);
  console.log('API: JSON.stringify(device):', JSON.stringify(device, null, 2));
  
  // Wysyłaj dokładnie taki sam format jak addDevice
  const response = await api.put(`/urzadzenia/full/${id}`, device);
  console.log('API: response:', response);
};