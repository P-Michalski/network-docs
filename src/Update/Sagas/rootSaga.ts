import { all } from 'redux-saga/effects';
import devicesSaga from './devicesSaga';
import connectionsSaga from './connectionsSaga';

export default function* rootSaga() {
  yield all([
    devicesSaga(),
    connectionsSaga(),
  ]);
}
