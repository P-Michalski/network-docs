import api from './axios';
import type { Device, DeviceDetails } from '../types/device';

export const fetchDevicesDetails = async (): Promise<DeviceDetails[]> => {
  const response = await api.get<DeviceDetails[]>('/urzadzenia/all-details');
  return response.data;
};

export const fetchDevice = async (id: number): Promise<Device> => {
  const response = await api.get<Device>(`/urzadzenia/${id}`);
  return response.data;
};

export const fetchDeviceDetails = async (id: number): Promise<DeviceDetails> => {
  const response = await api.get<DeviceDetails>(`/urzadzenia/${id}/all`);
  return response.data;
};

export const addDevice = async (device: Omit<Device, 'id_u'>): Promise<void> => {
  await api.post('/urzadzenia', device);
};