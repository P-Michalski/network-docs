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
    deleteDeviceRequest(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    deleteDeviceSuccess(state) {
      state.loading = false;
    },
    deleteDeviceFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateDeviceRequest(state, _action: PayloadAction<any>) {
      state.loading = true;
      state.error = null;
    },
    updateDeviceSuccess(state) {
      state.loading = false;
    },
    updateDeviceFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // --- CONNECTIONS ---
    addConnectionRequest(state, _action: PayloadAction<any>) {
      state.loading = true;
      state.error = null;
    },
    addConnectionSuccess(state) {
      state.loading = false;
    },
    addConnectionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteConnectionRequest(state, _action: PayloadAction<any>) {
      state.loading = true;
      state.error = null;
    },
    deleteConnectionSuccess(state) {
      state.loading = false;
    },
    deleteConnectionFailure(state, action: PayloadAction<string>) {
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
  deleteDeviceRequest,
  deleteDeviceSuccess,
  deleteDeviceFailure,
  updateDeviceRequest,
  updateDeviceSuccess,
  updateDeviceFailure,
  addConnectionRequest,
  addConnectionSuccess,
  addConnectionFailure,
  deleteConnectionRequest,
  deleteConnectionSuccess,
  deleteConnectionFailure,
} = devicesSlice.actions;

export const devicesReducer = devicesSlice.reducer;
