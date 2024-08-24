//import AppRoutes from './routes';
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import Login from "./pages/login/login";
import HomePage from "./pages/home/Home";
import Dashboard from "./pages/DashBoard/DashHome";
import UserHome from "./pages/User/Userpage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Userpage" element={<UserHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;