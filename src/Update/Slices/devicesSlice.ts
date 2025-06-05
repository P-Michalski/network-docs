import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { DeviceDetails } from '../../Models/DeviceDetails.class';

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
    fetchDevicesSuccess(state, action: PayloadAction<any[]>) {
      state.devices = action.payload; // plain objects only
      state.loading = false;
    },
    fetchDevicesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addDeviceRequest(state, _action: PayloadAction<any>) {
      state.loading = true;
      state.error = null;
    },
    addDeviceSuccess(state) {
      state.loading = false;
    },
    addDeviceFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDevicesRequest,
  fetchDevicesSuccess,
  fetchDevicesFailure,
  addDeviceRequest,
  addDeviceSuccess,
  addDeviceFailure,
} = devicesSlice.actions;

export const devicesReducer = devicesSlice.reducer;
