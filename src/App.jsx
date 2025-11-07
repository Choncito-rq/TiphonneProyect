import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./paginas/Login.jsx";

import Home from "./paginas/home.jsx";
import "./App.css";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>

        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
