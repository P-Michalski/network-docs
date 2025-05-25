import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DeviceDetails } from '../types/device';

interface DevicesState {
  devices: DeviceDetails[];
  loading: boolean;
  error: string | null;
}

const initialState: DevicesState = {
  devices: [],
  loading: false,
  error: null,
};

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    fetchDevicesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDevicesSuccess(state, action: PayloadAction<DeviceDetails[]>) {
      state.devices = action.payload;
      state.loading = false;
    },
    fetchDevicesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDevicesRequest,
  fetchDevicesSuccess,
  fetchDevicesFailure,
} = devicesSlice.actions;

export const devicesReducer = devicesSlice.reducer;
