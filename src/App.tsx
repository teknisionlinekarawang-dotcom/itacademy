import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import IotPage from './pages/IotPage';
import CrimpingPage from './pages/CrimpingPage';
import IPAddressPage from './pages/IPAddressPage';
import FiberOpticPage from './pages/FiberOpticPage';
import FiberOpticMappingPage from './pages/FiberOpticMappingPage';
import TopologyPage from './pages/TopologyPage';
import CpuPage from './pages/CpuPage';
import RamStoragePage from './pages/RamStoragePage';
import OsPage from './pages/OsPage';
import BasicComputerPage from './pages/BasicComputerPage';
import MikrotikPage from './pages/MikrotikPage';
import DigitalComputationPage from './pages/DigitalComputationPage';
import WifiPage from './pages/WifiPage';
import GpuPage from './pages/GpuPage';
import ESPArduinoPage from './pages/ESPArduinoPage';
import SensorModulesPage from './pages/SensorModulesPage';
import SocketPage from './pages/SocketPage';
import ProtocolsPage from './pages/ProtocolsPage';
import InternetWorking from './pages/InternetWorking';
import TooltipSimulatorPage from './pages/TooltipSimulatorPage';
import CyberSecurityPage from './pages/CyberSecurityPage';
import ServerPage from './pages/ServerPage';
import { ImageModalProvider } from './context/ImageModalContext';
import ImageViewerModal from './components/ImageViewerModal';

// Aplikasi belajar murni: katalog modul + simulator.
// Tidak ada login, portal siswa/admin, maupun kuis publik.
export default function App() {
  return (
    <ImageModalProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="module/crimping" element={<CrimpingPage />} />
          <Route path="module/ip-address" element={<IPAddressPage />} />
          <Route path="module/fiber-optic" element={<FiberOpticPage />} />
          <Route path="module/topology" element={<TopologyPage />} />
          <Route path="module/internet-working" element={<InternetWorking />} />
          <Route path="module/tooltip-simulator" element={<TooltipSimulatorPage />} />
          <Route path="module/ftth-mapping" element={<FiberOpticMappingPage />} />
          <Route path="module/cpu-details" element={<CpuPage />} />
          <Route path="module/os-details" element={<OsPage />} />
          <Route path="module/ram-storage-details" element={<RamStoragePage />} />
          <Route path="module/basic-computer" element={<BasicComputerPage />} />
          <Route path="module/digital-computation" element={<DigitalComputationPage />} />
          <Route path="module/wifi" element={<WifiPage />} />
          <Route path="module/iot-intro" element={<IotPage />} />
          <Route path="module/gpu-details" element={<GpuPage />} />
          <Route path="module/esp-arduino" element={<ESPArduinoPage />} />
          <Route path="module/sensor-modules" element={<SensorModulesPage />} />
          <Route path="module/network-protocols" element={<ProtocolsPage />} />
          <Route path="module/mikrotik-intro" element={<MikrotikPage />} />
          <Route path="module/socket-details" element={<SocketPage />} />
          <Route path="module/cyber-security" element={<CyberSecurityPage />} />
          <Route path="module/server" element={<ServerPage />} />
        </Route>

        {/* Rute tak dikenal → kembali ke katalog */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ImageViewerModal />
    </ImageModalProvider>
  );
}
