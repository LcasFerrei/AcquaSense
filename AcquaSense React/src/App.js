//import AppRoutes from './routes';
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import Login from "./pages/login/login";
import HomePage from "./pages/home/Home";
import Dashboard from "./pages/DashBoard/DashHome";
import UserHome from "./pages/User/Userpage";
import ConsumoHome  from "./pages/Consumo/ConsumoHome";
import ManutenHome from "./pages/Manutencion/ManutenHome";
import MonitoringHome from "./pages/Monitoramento/HomeMonitoring";
import ConfiguHome from "./pages/Configu/ConfiguHome";
import NotificationHome from "./pages/NotificationHome/NotificationHome";



function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Userpage" element={<UserHome />} />
        <Route path="/Consumptiondaily" element={<ConsumoHome />} />
        <Route path="/Maintenance" element={<ManutenHome />} />
        <Route path="/SpecificMonitoring" element={<MonitoringHome />} />
        <Route path="/Configuration" element={<ConfiguHome />} />
        <Route path="/Notification" element={<NotificationHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;