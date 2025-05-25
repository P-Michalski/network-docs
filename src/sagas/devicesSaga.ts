import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchDevicesDetails } from '../api/device';
import {
  fetchDevicesRequest,
  fetchDevicesSuccess,
  fetchDevicesFailure,
} from '../slices/devicesSlice';

import type { SagaIterator } from 'redux-saga';

function* fetchDevicesSaga(): SagaIterator {
  try {
    const devices = yield call(fetchDevicesDetails);
    yield put(fetchDevicesSuccess(devices));
  } catch (error: any) {
    yield put(fetchDevicesFailure(error.message || 'Błąd podczas ładowania urządzeń'));
  }
}

export default function* devicesSaga() {
  yield takeLatest(fetchDevicesRequest.type, fetchDevicesSaga);
}
