import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchDevicesDetails, addDevice } from '../../api/device';
import {
  fetchDevicesRequest,
  fetchDevicesSuccess,
  fetchDevicesFailure,
  addDeviceRequest,
  addDeviceSuccess,
  addDeviceFailure,
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

export default function* devicesSaga() {
  yield takeLatest(fetchDevicesRequest.type, fetchDevicesSaga);
  yield takeLatest(addDeviceRequest.type, addDeviceSaga);
}
