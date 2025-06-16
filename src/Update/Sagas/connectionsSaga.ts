import { call, put, takeLatest } from 'redux-saga/effects';
import {
  addConnectionRequest,
  addConnectionSuccess,
  addConnectionFailure,
  deleteConnectionRequest,
  deleteConnectionSuccess,
  deleteConnectionFailure,
  type AddConnectionPayload,
  type DeleteConnectionPayload,
} from '../Slices/connectionsSlice';
import { fetchDevicesRequest } from '../Slices/devicesSlice';
import axios from '../../api/axios';
import type { SagaIterator } from 'redux-saga';
import type { PayloadAction } from '@reduxjs/toolkit';

// --- SAGA: DODAWANIE POŁĄCZENIA ---
function* addConnectionSaga(action: PayloadAction<AddConnectionPayload>): SagaIterator {
  try {
    const { connectionType, payload } = action.payload;
    
    console.log('ConnectionsSaga: addConnectionSaga wywołana', { connectionType, payload });
    
    if (connectionType === 'port') {
      yield call([axios, axios.post], '/polaczony_z', payload);
    } else if (connectionType === 'wifi') {
      yield call([axios, axios.post], '/polaczona_z', payload);
    } else {
      throw new Error(`Nieznany typ połączenia: ${connectionType}`);
    }
    
    yield put(addConnectionSuccess());
    // Odśwież listę urządzeń po dodaniu połączenia
    yield put(fetchDevicesRequest());
    
    console.log('ConnectionsSaga: Połączenie dodane pomyślnie');
  } catch (error: any) {
    console.error('ConnectionsSaga: Błąd podczas addConnectionSaga:', error);
    yield put(addConnectionFailure(error.message || 'Błąd podczas dodawania połączenia'));
  }
}

// --- SAGA: USUWANIE POŁĄCZENIA ---
function* deleteConnectionSaga(action: PayloadAction<DeleteConnectionPayload>): SagaIterator {
  try {
    const { connectionType, payload } = action.payload;
    
    console.log('ConnectionsSaga: deleteConnectionSaga wywołana', { connectionType, payload });
    
    if (connectionType === 'port') {
      yield call([axios, axios.delete], '/polaczony_z', { data: payload });
    } else if (connectionType === 'wifi') {
      yield call([axios, axios.delete], '/polaczona_z', { data: payload });
    } else {
      throw new Error(`Nieznany typ połączenia: ${connectionType}`);
    }
    
    yield put(deleteConnectionSuccess());
    // Odśwież listę urządzeń po usunięciu połączenia
    yield put(fetchDevicesRequest());
    
    console.log('ConnectionsSaga: Połączenie usunięte pomyślnie');
  } catch (error: any) {
    console.error('ConnectionsSaga: Błąd podczas deleteConnectionSaga:', error);
    yield put(deleteConnectionFailure(error.message || 'Błąd podczas usuwania połączenia'));
  }
}

// --- POMOCNICZE FUNKCJE DLA URZĄDZEŃ ---
export function* removeDeviceConnections(conns: { port: any[]; wifi: any[] }): SagaIterator {
  try {
    console.log('ConnectionsSaga: Usuwanie połączeń urządzenia', conns);
    
    // Usuń połączenia portów
    for (const c of conns.port) {
      yield call([axios, axios.delete], '/polaczony_z', { 
        data: { id_p_1: c.id_p_1, id_p_2: c.id_p_2 } 
      });
    }
    
    // Usuń połączenia WiFi
    for (const c of conns.wifi) {
      yield call([axios, axios.delete], '/polaczona_z', { 
        data: { id_k_1: c.id_k_1, id_k_2: c.id_k_2 } 
      });
    }
    
    console.log('ConnectionsSaga: Połączenia urządzenia usunięte pomyślnie');
  } catch (error: any) {
    console.error('ConnectionsSaga: Błąd podczas usuwania połączeń urządzenia:', error);
    throw error;
  }
}

export function* restoreDeviceConnections(conns: { port: any[]; wifi: any[] }): SagaIterator {
  try {
    console.log('ConnectionsSaga: Przywracanie połączeń urządzenia', conns);
    
    // Przywróć połączenia portów
    for (const c of conns.port) {
      yield call([axios, axios.post], '/polaczony_z', c);
    }
    
    // Przywróć połączenia WiFi
    for (const c of conns.wifi) {
      yield call([axios, axios.post], '/polaczona_z', c);
    }
    
    console.log('ConnectionsSaga: Połączenia urządzenia przywrócone pomyślnie');
  } catch (error: any) {
    console.error('ConnectionsSaga: Błąd podczas przywracania połączeń urządzenia:', error);
    throw error;
  }
}

export default function* connectionsSaga() {
  yield takeLatest(addConnectionRequest.type, addConnectionSaga);
  yield takeLatest(deleteConnectionRequest.type, deleteConnectionSaga);
}
