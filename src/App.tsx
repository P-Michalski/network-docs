import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeviceListPage from './pages/DeviceListPage';
import AddDevicePage from './pages/AddDevicePage';
import ConnectionManagerPage from './pages/ConnectionManagerPage';
import NetworkMapPage from './pages/NetworkMapPage';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/devices" />} />
        <Route path="/devices" element={<DeviceListPage />} />
        <Route path="/devices/add" element={<AddDevicePage />} />
        <Route path="/connections" element={<ConnectionManagerPage />} />
        <Route path="/network-map" element={<NetworkMapPage />} />
      </Routes>
    </>
  );
};

export default App;