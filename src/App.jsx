import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./paginas/Login.jsx";
import Registro_nuevo from "./paginas/registro.jsx";
import Recover from "./paginas/Recover_Passwords.jsx";
import VerifyToken from "./paginas/Token_Recieve.jsx";
import Home from "./paginas/home.jsx";
import New from "./paginas/New_Password.jsx";
import EditarPerfil from "./componentes/editarperfil.jsx";
import CrearSubasta from "./componentes/crearSubasta.jsx";
import MisPujas from "./componentes/historialDePujas.jsx";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Registrarme" element={<Registro_nuevo />} />
        <Route path="/Verify" element={<VerifyToken />} />
        <Route path="/Recovered/NewPassword" element={<New />} />
        <Route path="/Recovered" element={<Recover />} />
        <Route path="/home" element={<Home />}></Route>
        <Route path="/editar-perfil" element={<EditarPerfil />}></Route>
        <Route path="/crear-subasta" element={<CrearSubasta />}></Route>
        <Route path="/mis-pujas" element={<MisPujas />} />
      </Routes>
    </BrowserRouter>
  );
}
