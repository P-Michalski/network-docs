import { call, put, takeLatest, select } from 'redux-saga/effects';
import { fetchDevicesDetails, addDevice, deleteDevice, updateDevice } from '../../api/device';
import { removeDeviceConnections, restoreDeviceConnections } from './connectionsSaga';
import {
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
} from '../Slices/devicesSlice';
// Dodaj importy axios (do połączeń) i ewentualnie store, jeśli potrzebne

import type { SagaIterator } from 'redux-saga';
import type { RootState } from '../../store';

function* fetchDevicesSaga(): SagaIterator {
  try {
    const devices = yield call(fetchDevicesDetails);
    console.log('Saga: pobrane urządzenia jako klasy:', devices);
    
    // Konwertuj obiekty klasy na plain objects przed przekazaniem do Redux
    const serializedDevices = devices.map((device: any) => ({
      ...device,
      // Upewnij się, że wszystkie nested objects też są serializowalne
      urzadzenie: { ...device.urzadzenie },
      porty: device.porty?.map((port: any) => ({ ...port })) || [],
      karty_wifi: device.karty_wifi?.map((card: any) => ({ ...card })) || [],
    }));
    
    yield put(fetchDevicesSuccess(serializedDevices));
  } catch (error: any) {
    yield put(fetchDevicesFailure(error.message || 'Błąd podczas ładowania urządzeń'));
  }
}

function* addDeviceSaga(action: any): SagaIterator {
  try {
    console.log('SAGA: addDeviceSaga wywołana z payload:', action.payload);
    console.log('SAGA: JSON.stringify(payload):', JSON.stringify(action.payload, null, 2));
    
    yield call(addDevice, action.payload);
    yield put(addDeviceSuccess());
    // Po dodaniu odśwież listę
    yield put(fetchDevicesRequest());
  } catch (error: any) {
    console.error('SAGA: Błąd podczas addDeviceSaga:', error);
    yield put(addDeviceFailure(error.message || 'Błąd podczas dodawania urządzenia'));
  }
}

function* deleteDeviceSaga(action: any): SagaIterator {
  try {
    yield call(deleteDevice, action.payload); // payload to id_u
    yield put(deleteDeviceSuccess());
    yield put(fetchDevicesRequest()); // odśwież listę po usunięciu
  } catch (error: any) {
    yield put(deleteDeviceFailure(error.message || 'Błąd podczas usuwania urządzenia'));
  }
}

// Pomocnicze: wykryj połączenia urządzenia
function* getDeviceConnectionsForUpdate(deviceId: number) {
  const state: RootState = yield select();
  const device = state.devices.devices.find((d: any) => d.urzadzenie.id_u === deviceId);
  if (!device) return { port: [] as any[], wifi: [] as any[] };
  // Porty
  const portConnections: any[] = [];
  device.porty?.forEach((port: any) => {
    port.polaczenia_portu?.forEach((conn: any) => {
      portConnections.push({ id_p_1: port.id_p, id_p_2: conn.id_p_2, max_predkosc: conn.max_predkosc });
    });
  });
  // Karty WiFi
  const wifiConnections: any[] = [];
  device.karty_wifi?.forEach((card: any) => {
    card.polaczenia_karty?.forEach((conn: any) => {
      wifiConnections.push({ id_k_1: conn.id_k_1, id_k_2: conn.id_k_2, max_predkosc: conn.max_predkosc, pasmo: conn.pasmo });
    });
  });
  return { port: portConnections, wifi: wifiConnections };
}

// --- PATCH updateDeviceSaga ---
function* updateDeviceSaga(action: any): SagaIterator {
  let connections;
  try {
    // 1. Wykryj połączenia
    connections = yield call(getDeviceConnectionsForUpdate, action.payload.id_u);
    const hasConnections = connections.port.length > 0 || connections.wifi.length > 0;
    if (hasConnections) {
      // 2. Usuń połączenia
      yield call(removeDeviceConnections, connections);
    }
    // 3. Update
    yield call(updateDevice, action.payload.id_u, action.payload.device);
    // 4. Przywróć połączenia
    if (hasConnections) {
      yield call(restoreDeviceConnections, connections);
    }
    yield put(updateDeviceSuccess());
    yield put(fetchDevicesRequest());
  } catch (error: any) {
    // Jeśli coś pójdzie nie tak, spróbuj przywrócić połączenia
    if (connections && (connections.port.length > 0 || connections.wifi.length > 0)) {
      try { yield call(restoreDeviceConnections, connections); } catch {}
    }
    yield put(updateDeviceFailure(error.message || 'Błąd podczas edycji urządzenia'));
  }
}

export default function* devicesSaga() {
  yield takeLatest(fetchDevicesRequest.type, fetchDevicesSaga);
  yield takeLatest(addDeviceRequest.type, addDeviceSaga);
  yield takeLatest(deleteDeviceRequest.type, deleteDeviceSaga);
  yield takeLatest(updateDeviceRequest.type, updateDeviceSaga);
}

// UWAGA: W przyszłości należy usunąć również połączenia, w których urządzenie uczestniczyło (TODO w backendzie).
