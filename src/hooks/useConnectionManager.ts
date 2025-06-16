import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDevicesRequest } from '../Update/Slices/devicesSlice';
import { useConnections } from './useConnections';
import { useConnectionForm } from './useConnectionForm';
import { useConnectionValidation } from './useConnectionValidation';
import { useConnectionsList } from './useConnectionsList';

export const useConnectionManager = () => {
  const dispatch = useDispatch();
  const { loading: connectionsLoading, error: connectionsError, addConnection, removeConnection } = useConnections();
    // Form management
  const formHook = useConnectionForm();
  const {
    connectionType,
    device1,
    device2,
    portOrCard1,
    portOrCard2,
    success,
    devices,
    device1Obj,
    device2Obj,
    allPorts1,
    allPorts2,
    availableCards1,
    availableCards2,
    setConnectionType,
    setDevice1,
    setDevice2,
    setPortOrCard1,
    setPortOrCard2,
    setSuccess,
    resetForm,
    isPortOccupied,
    isWifiCardOccupied
  } = formHook;
  
  // Validation
  const validationHook = useConnectionValidation();  const {
    validationErrors,
    hasValidated,
    setValidationErrors,
    setHasValidated,
    getMaxWifiSpeed,
    getCommonBand,
    getMaxPortSpeed
  } = validationHook;
  
  // Connections list
  const connectionsListHook = useConnectionsList();
  const {
    allConnections,
    filteredConnections,
    panelTab,
    setPanelTab,
    showInfoPanel,
    selectedConnection,
    handleShowInfo,
    handleCloseInfo
  } = connectionsListHook;

  // Derived states for filtering and availability
  const availablePorts1 = allPorts1.filter(port => 
    !isPortOccupied(port.id_p, device1 as number) && 
    port.status === 'aktywny'
  );
  
  const availablePorts2 = allPorts2.filter(port => 
    !isPortOccupied(port.id_p, device2 as number) &&
    port.status === 'aktywny'
  );
  // Helper function to check if devices are already connected
  const areDevicesConnected = (_device1Id: number, _device2Id: number, type: 'port' | 'wifi') => {
    return allConnections.some(conn => {
      if (conn.type !== type) return false;
      
      const device1Name = device1Obj?.urzadzenie.nazwa_urzadzenia;
      const device2Name = device2Obj?.urzadzenie.nazwa_urzadzenia;
      
      return (
        (conn.device1 === device1Name && conn.device2 === device2Name) ||
        (conn.device1 === device2Name && conn.device2 === device1Name)
      );
    });
  };

  // Enhanced validation function that includes all business logic
  const validateForm = (showAllErrors = false) => {
    const errors = validationHook.validateForm(
      connectionType,
      device1,
      device2,
      portOrCard1,
      portOrCard2,
      device1Obj,
      device2Obj,
      showAllErrors
    );

    // Additional validations specific to this component
    const additionalErrors: any = {};

    // Check if ports/cards are occupied or inactive
    if (portOrCard1 && device1) {
      if (connectionType === 'port') {
        const port1 = device1Obj?.porty?.find(p => p.id_p === portOrCard1);
        if (isPortOccupied(portOrCard1 as number, device1 as number)) {
          additionalErrors.portOrCard1 = 'Ten port jest już zajęty';
        } else if (port1?.status !== 'aktywny') {
          additionalErrors.portOrCard1 = 'Ten port jest nieaktywny';
        }
      } else if (connectionType === 'wifi' && isWifiCardOccupied(portOrCard1 as number, device1 as number)) {
        additionalErrors.portOrCard1 = 'Ta karta WiFi jest już zajęta';
      }
    }
    
    if (portOrCard2 && device2) {
      if (connectionType === 'port') {
        const port2 = device2Obj?.porty?.find(p => p.id_p === portOrCard2);
        if (isPortOccupied(portOrCard2 as number, device2 as number)) {
          additionalErrors.portOrCard2 = 'Ten port jest już zajęty';
        } else if (port2?.status !== 'aktywny') {
          additionalErrors.portOrCard2 = 'Ten port jest nieaktywny';
        }
      } else if (connectionType === 'wifi' && isWifiCardOccupied(portOrCard2 as number, device2 as number)) {
        additionalErrors.portOrCard2 = 'Ta karta WiFi jest już zajęta';
      }
    }
    
    // Check if devices are already connected
    if (device1 && device2 && device1 !== device2) {
      if (areDevicesConnected(device1 as number, device2 as number, connectionType)) {
        additionalErrors.general = `Urządzenia są już połączone przez ${connectionType === 'port' ? 'port' : 'WiFi'}`;
      }
    }

    const finalErrors = { ...errors, ...additionalErrors };
    
    if (showAllErrors || hasValidated) {
      setValidationErrors(finalErrors);
    }
    
    return Object.keys(finalErrors).length === 0;
  };

  // Handle form submission
  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    
    // Mark that validation has been triggered
    setHasValidated(true);
    
    // Run validation and force showing all errors
    const isValid = validateForm(true);
    
    if (!isValid) {
      return;
    }

    // Additional check for same device/port
    if (device1 === device2 && portOrCard1 === portOrCard2) {
      setValidationErrors({ general: 'Nie można połączyć portu/karty z samym sobą' });
      return;
    }
    
    try {
      if (connectionType === 'port') {
        const port1 = device1Obj?.porty?.find((p: any) => p.id_p === portOrCard1);
        const port2 = device2Obj?.porty?.find((p: any) => p.id_p === portOrCard2);
        const max_predkosc = getMaxPortSpeed(port1, port2);
        
        addConnection({
          connectionType: 'port',
          payload: { id_p_1: portOrCard1 as number, id_p_2: portOrCard2 as number, max_predkosc }
        });
      } else {
        const card1 = device1Obj?.karty_wifi?.find((c: any) => c.id_k === portOrCard1);
        const card2 = device2Obj?.karty_wifi?.find((c: any) => c.id_k === portOrCard2);
        
        const max_predkosc = getMaxWifiSpeed(card1, card2);
        const pasmo = getCommonBand(card1, card2);
        
        if (pasmo === 'brak') {
          setValidationErrors({ general: 'Karty WiFi nie mają wspólnego pasma' });
          return;
        }
        
        addConnection({
          connectionType: 'wifi',
          payload: { id_k_1: portOrCard1 as number, id_k_2: portOrCard2 as number, max_predkosc, pasmo }
        });
      }
      
      setSuccess('Połączenie zostało dodane');
      resetForm();
      setValidationErrors({});
      setHasValidated(false);
    } catch (err) {
      setValidationErrors({ general: 'Błąd podczas dodawania połączenia' });
    }
  };

  // Handle connection removal
  const handleRemoveConnection = (connection: any) => {
    removeConnection({
      connectionType: connection.type,
      payload: connection.type === 'port' 
        ? { id_p_1: connection.id_p_1, id_p_2: connection.id_p_2 }
        : { id_k_1: connection.id_k_1, id_k_2: connection.id_k_2 }
    });
  };

  // Effect to fetch devices if needed
  useEffect(() => {
    if (allConnections.length === 0) {
      dispatch(fetchDevicesRequest());
    }
  }, [allConnections.length, dispatch]);

  // Effect for live validation after first submit
  useEffect(() => {
    if (hasValidated) {
      validateForm();
    }
  }, [device1, device2, portOrCard1, portOrCard2, connectionType, hasValidated]);
  return {
    // Form state
    connectionType,
    device1,
    device2,
    portOrCard1,
    portOrCard2,
    success,
    devices,
    device1Obj,
    device2Obj,
    allPorts1,
    allPorts2,
    availablePorts1,
    availablePorts2,
    availableCards1,
    availableCards2,
    
    // Validation state
    validationErrors,
    hasValidated,
      // Connections list state
    allConnections,
    filteredConnections,
    panelTab,
    showInfoPanel,
    selectedConnection,
    
    // Loading states
    connectionsLoading,
    connectionsError,
    
    // Actions
    setConnectionType,
    setDevice1,
    setDevice2,
    setPortOrCard1,
    setPortOrCard2,
    setPanelTab,
    handleAddConnection,
    handleRemoveConnection,
    handleShowInfo,
    handleCloseInfo,
    
    // Helper functions
    isPortOccupied,
    isWifiCardOccupied,
    areDevicesConnected
  };
};
