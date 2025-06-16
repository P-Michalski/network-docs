import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ConnectionsState {
  loading: boolean;
  error: string | null;
}

const initialState: ConnectionsState = {
  loading: false,
  error: null,
};

export interface AddConnectionPayload {
  connectionType: 'port' | 'wifi';
  payload: {
    id_p_1?: number;
    id_p_2?: number;
    id_k_1?: number;
    id_k_2?: number;
    max_predkosc?: string;
    pasmo?: string;
  };
}

export interface DeleteConnectionPayload {
  connectionType: 'port' | 'wifi';
  payload: {
    id_p_1?: number;
    id_p_2?: number;
    id_k_1?: number;
    id_k_2?: number;
  };
}

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    addConnectionRequest(state, _action: PayloadAction<AddConnectionPayload>) {
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
    deleteConnectionRequest(state, _action: PayloadAction<DeleteConnectionPayload>) {
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
    clearConnectionError(state) {
      state.error = null;
    },
  },
});

export const {
  addConnectionRequest,
  addConnectionSuccess,
  addConnectionFailure,
  deleteConnectionRequest,
  deleteConnectionSuccess,
  deleteConnectionFailure,
  clearConnectionError,
} = connectionsSlice.actions;

export const connectionsReducer = connectionsSlice.reducer;
