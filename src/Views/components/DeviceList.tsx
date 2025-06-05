import { useEffect, useState } from 'react';
import { fetchDevicesDetails } from '../../api/device';
import { DeviceDetails } from '../../Models/DeviceDetails.class';

const DeviceList = () => {
  const [devices, setDevices] = useState<DeviceDetails[]>([]);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const data = await fetchDevicesDetails();
        setDevices(data);
      } catch (err) {
        console.error('Błąd podczas ładowania urządzeń:', err);
      }
    };

    loadDevices();
  }, []);

  return (
    <div>
      <h2>Lista urządzeń (testowo pełne dane)</h2>
      <ul>
        {devices.map((device) => (
          <li key={device.urzadzenie.id_u} style={{ marginBottom: 24, border: '1px solid #ccc', padding: 12 }}>
            <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{JSON.stringify(device, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceList;