import { all } from 'redux-saga/effects';
import devicesSaga from './devicesSaga';

export default function* rootSaga() {
  yield all([
    devicesSaga(),
  ]);
}
