import api from './axios';
import { Device } from '../Models/Device.class';
import { DeviceDetails } from '../Models/DeviceDetails.class';

export const fetchDevices = async (): Promise<Device[]> => {
  const response = await api.get('/urzadzenia');
  return response.data.map(Device.fromApi);
};

export const fetchDevicesDetails = async (): Promise<DeviceDetails[]> => {
  const response = await api.get('/urzadzenia/all-details');
  return response.data.map(DeviceDetails.fromApi);
};

export const fetchDevice = async (id: number): Promise<Device> => {
  const response = await api.get<Device>(`/urzadzenia/${id}`);
  return response.data;
};

export const fetchDeviceDetails = async (id: number): Promise<DeviceDetails> => {
  const response = await api.get<DeviceDetails>(`/urzadzenia/${id}/all`);
  return response.data;
};

export const addDevice = async (device: Omit<DeviceDetails, 'urzadzenie' | 'typ' | 'porty' | 'karty_wifi' | 'mac' | 'lokalizacja'> & DeviceDetails): Promise<void> => {
  await api.post('/urzadzenia/full', device);
};