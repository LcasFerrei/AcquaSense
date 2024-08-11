//import AppRoutes from './routes';
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import Login from "./pages/login/login";
import HomePage from "./pages/home/Home";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;