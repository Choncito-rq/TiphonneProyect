import menuIcon from "../assets/menusss.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./appbar.css";

export default function Appbar({ configOpen, setConfigOpen }) {
  const navigate = useNavigate();
  const [showPanel, setShowPanel] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const abrirMenu = () => {
    const stored = localStorage.getItem("user");
    setUsuario(stored ? JSON.parse(stored) : null);

    setShowPanel(true);
    setConfigOpen(true);
  };

  const cerrarMenu = () => {
    setConfigOpen(false);
    setTimeout(() => setShowPanel(false), 250); // tiempo de animación
  };
  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUsuario(stored ? JSON.parse(stored) : null);
  }, []);
  return (
    <>
      <header className="appbar">
        <h1 className="logo">Tiphonne</h1>

        <img
          src={menuIcon}
          alt="menu"
          className="menu-icon"
          onClick={abrirMenu}
        />
      </header>

      {showPanel && (
        <div
          className={`config-overlay ${configOpen ? "open" : "close"}`}
          onClick={cerrarMenu}
        >
          <div
            className={`config-panel ${configOpen ? "open" : "close"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={cerrarMenu}>
              ✕
            </button>

            <h2>Configuración</h2>

            {/* PERFIL */}
            <section className="config-section">
              <h3>Mi Cuenta</h3>

              <p>
                <strong>Usuario:</strong> {usuario?.usuario?.nom_1}
              </p>
              <p>
                <strong>Correo:</strong>{" "}
                {usuario?.usuario?.correo || "Desconocido"}
              </p>

              <button
                className="config-btn"
                onClick={() => navigate("/editar-perfil")}
              >
                Editar perfil
              </button>

              <button
                className="config-btn"
                onClick={() => navigate("/Recovered")}
              >
                Cambiar contraseña
              </button>
            </section>

            {/* SUBASTAS */}
            <section className="config-section">
              <button
                className="config-btn"
                onClick={() => navigate("/mis-pujas")}
              >
                Historial de pujas
              </button>
            </section>

            {/* PARA VENDEDORES */}
            <section className="config-section">
              <h3>Acciones</h3>

              <button
                className="config-btn"
                onClick={() => navigate("/crear-subasta")}
              >
                Crear Subasta
              </button>

              <button className="config-btn">Artículos vendidos</button>
            </section>

            {/* SOPORTE */}
            <section className="config-section">
              <h3>Ayuda</h3>

              <button className="config-btn">Reportar problema</button>
              <button className="config-btn">Términos y condiciones</button>
              <button className="config-btn">Privacidad</button>
            </section>

            {/* CERRAR SESIÓN */}
            <button
              type="button"
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/", { replace: true });
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
}
