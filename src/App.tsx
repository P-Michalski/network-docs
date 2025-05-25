import React from 'react';
import { Route, Navigate, HashRouter, Routes } from 'react-router-dom';
import DeviceListPage from './pages/DeviceListPage';
import AddDevicePage from './pages/AddDevicePage';
import ConnectionManagerPage from './pages/ConnectionManagerPage';
import NetworkMapPage from './pages/NetworkMapPage';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/devices" element={<DeviceListPage />} />
        <Route path="/addDevice" element={<AddDevicePage />} />
        <Route path="/connections" element={<ConnectionManagerPage />} />
        <Route path="/network-map" element={<NetworkMapPage />} />
        <Route path="*" element={<Navigate to="/devices" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;