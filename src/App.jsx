import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./paginas/Login.jsx";
import Registro_nuevo from "./paginas/registro.jsx";
import Recover from "./paginas/Recover_Passwords.jsx";
import VerifyToken from "./paginas/Token_Recieve.jsx";
import Home from "./paginas/home.jsx";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Registrarme" element={<Registro_nuevo />} />
        <Route path="/Verify" element={<VerifyToken />} />
        <Route path="/Recovered" element={<Recover />} />
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
