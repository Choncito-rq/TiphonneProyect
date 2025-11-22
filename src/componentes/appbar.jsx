import menuIcon from "../assets/menusss.svg";
import "./appbar.css";

export default function Appbar({ configOpen, setConfigOpen, user }) {
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
            <h2>⚙ Configuración</h2>

            <p className="config-label">
              <strong>Usuario:</strong> {user?.nombre || "Invitado"}
            </p>

            <p className="config-label">
              <strong>Correo:</strong> {user?.correo || "Desconocido"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
