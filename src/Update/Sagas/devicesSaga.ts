import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchDevicesDetails, addDevice, deleteDevice, updateDevice } from '../../api/device';
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

import type { SagaIterator } from 'redux-saga';

function* fetchDevicesSaga(): SagaIterator {
  try {
    const devices = yield call(fetchDevicesDetails);
    const plainDevices = devices.map((d: any) => JSON.parse(JSON.stringify(d)));
    yield put(fetchDevicesSuccess(plainDevices));
  } catch (error: any) {
    yield put(fetchDevicesFailure(error.message || 'Błąd podczas ładowania urządzeń'));
  }
}

function* addDeviceSaga(action: any): SagaIterator {
  try {
    yield call(addDevice, action.payload);
    yield put(addDeviceSuccess());
    // Po dodaniu odśwież listę
    yield put(fetchDevicesRequest());
  } catch (error: any) {
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

function* updateDeviceSaga(action: any): SagaIterator {
  try {
    yield call(updateDevice, action.payload.id_u, action.payload.device);
    yield put(updateDeviceSuccess());
    yield put(fetchDevicesRequest());
  } catch (error: any) {
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
