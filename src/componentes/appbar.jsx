import menuIcon from "../assets/menusss.svg";
import { useNavigate } from "react-router-dom";
import "./appbar.css";

export default function Appbar({ configOpen, setConfigOpen, user }) {
  const navigate = useNavigate();

  return (
    <>
      <header className="appbar">
        <h1 className="logo">Tiphonne</h1>

        {/* ÍCONO que abre el panel */}

        <img
          src={menuIcon}
          alt="menu"
          className="menu-icon"
          onClick={() => setConfigOpen(true)}
        />
      </header>

      {/* PANEL DE CONFIGURACIÓN */}
      {configOpen && (
        <div className="config-overlay" onClick={() => setConfigOpen(false)}>
          <div className="config-panel" onClick={(e) => e.stopPropagation()}>
            <h2> Configuración</h2>

            {/* perfil */}
            <section className="config-section">
              <h3>Mi Cuenta</h3>
              <p>
                <strong>Usuario:</strong> {user?.usuario?.nombre1}
              </p>
              <p>
                <strong>Correo:</strong>{" "}
                {user?.usuario?.correo || "Desconocido"}
              </p>

              <button
                className="config-btn"
                onClick={() => navigate("/editar-perfil")}
              >
                Editar perfil
              </button>

              <button className="config-btn">Cambiar contraseña</button>
            </section>

            {/* SUBASTAS */}
            <section className="config-section">
              <h3>Mis Subastas</h3>

              <button className="config-btn">Historial de pujas</button>
            </section>

            {/* SI EL USUARIO TAMBIÉN VENDE */}
            <section className="config-section">
              <h3>Subastar...</h3>

              <button
                className="config-btn"
                onClick={() => navigate("/crear-subasta")}
              >
                Crear Subasta
              </button>
              <button className="config-btn">Mis artículos publicados</button>
              <button className="config-btn">Artículos vendidos</button>
              {/*subastas que ya finalizaron y que son del current user*/}
            </section>

            {/* NAVEGACIÓN */}
            <section className="config-section">
              <h3>Navegación</h3>

              <button className="config-btn">Categorías</button>
              <button className="config-btn">Subastas nuevas</button>
              <button className="config-btn">
                Subastas que terminan pronto
              </button>
              <button className="config-btn">Recomendaciones</button>
            </section>

            {/* SOPORTE */}
            <section className="config-section">
              <h3> Ayuda</h3>1
              <button className="config-btn">Centro de ayuda</button>
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
              ⛔ Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
}
