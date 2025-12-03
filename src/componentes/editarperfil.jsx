import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./editarperfil.css";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};

  // Estados de los nuevos campos
  const [nombre1, setNombre1] = useState(usuario.nombre1 || "");
  const [nombre2, setNombre2] = useState(usuario.nombre2 || "");
  const [apellido1, setApellido1] = useState(usuario.apellido1 || "");
  const [apellido2, setApellido2] = useState(usuario.apellido2 || "");
  const [correo, setCorreo] = useState(usuario.correo || "");

  const guardarCambios = () => {
    const actualizado = {
      ...usuario,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      correo,
    };

    localStorage.setItem("usuario", JSON.stringify(actualizado));
    alert("Perfil actualizado");
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <button className="btn-volver" onClick={() => navigate(-1)}>
            ←
          </button>
          <h2>Editar Perfil</h2>
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label>Primer Nombre</label>
            <input
              type="text"
              value={nombre1}
              onChange={(e) => setNombre1(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Segundo Nombre</label>
            <input
              type="text"
              value={nombre2}
              onChange={(e) => setNombre2(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label>Primer Apellido</label>
            <input
              type="text"
              value={apellido1}
              onChange={(e) => setApellido1(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Segundo Apellido</label>
            <input
              type="text"
              value={apellido2}
              onChange={(e) => setApellido2(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <button className="btn-guardar" onClick={guardarCambios}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
