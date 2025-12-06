import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./editarperfil.css";
import iconback from "../assets/back_arrow.svg";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("user")) || {};

  const [nombre1, setNombre1] = useState(usuario.nom_1 || "");
  const [nombre2, setNombre2] = useState(usuario.nom_2 || "");
  const [apellido1, setApellido1] = useState(usuario.app_1 || "");
  const [apellido2, setApellido2] = useState(usuario.app_2 || "");
  const [correo, setCorreo] = useState(usuario.correo || "");

  const guardarCambios = async () => {
    try {
      const response = await fetch(
        `https://tiphonne-api-render.onrender.com/users/${usuario?.usuario?.id_usuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom_1: nombre1,
            nom_2: nombre2,
            app_1: apellido1,
            app_2: apellido2,
            correo: correo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al actualizar el usuario");
        return;
      }

      // Guardar la versión nueva del user en localStorage
      localStorage.setItem("user", JSON.stringify({ usuario: data.usuario }));

      alert("Perfil actualizado correctamente");

      navigate(-1); // volver a la pantalla anterior
    } catch (error) {
      console.error("Error en PUT:", error);
      alert("Hubo un error en la conexión con el servidor");
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <button className="btn-volver" onClick={() => navigate(-1)}>
            <img src={iconback} alt="back" />
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
