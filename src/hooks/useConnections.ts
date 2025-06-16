// src/hooks/useConnections.ts
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { addConnectionRequest, deleteConnectionRequest } from '../Update/Slices/connectionsSlice';

export const useConnections = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.connections);

  const addConnection = (connectionData: { connectionType: 'port' | 'wifi'; payload: any }) => {
    dispatch(addConnectionRequest(connectionData));
  };

  const removeConnection = (connectionData: { connectionType: 'port' | 'wifi'; payload: any }) => {
    dispatch(deleteConnectionRequest(connectionData));
  };

  return {
    loading,
    error,
    addConnection,
    removeConnection
  };
};