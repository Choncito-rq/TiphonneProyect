import CardSubasta from "../componentes/cardSubasta";
import "./home.css";
import Appbar from "../componentes/appbar";
import Modal from "../componentes/model";
import SubastaDetails from "../componentes/subastaDetails";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubasta, setSelectedSubasta] = useState(null);

  const [configOpen, setConfigOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
  }, []);

  // Datos simulados
  const subastas = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    titulo: `Artículo ${i + 1}`,
    imagen: `https://picsum.photos/400/30${i}`,
    precio_inicial: `${(Math.random() * 500).toFixed(2)} USD`,
    fecha_fin: "23/02/2025",
  }));

  const handleOpen = (subasta) => {
    setSelectedSubasta(subasta);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedSubasta(null);
    setIsOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Barra superior */}
      <Appbar />

      {/* Encabezado bonito */}
      <section className="home-header">
        <div>
          <h1>Subastas Disponibles</h1>
          <p>Explora artículos interesantes y participa en pujas activas.</p>
        </div>

        {/* Botón de configuración */}
        <button
          className="config-btn"
          onClick={() => setConfigOpen(true)}
        >
          Menu ⚙ 
        </button>
      </section>

      {/* Cards */}
      <div className="card-container">
        {subastas.map((subasta) => (
          <div key={subasta.id} onClick={() => handleOpen(subasta)}>
            <CardSubasta
              id={subasta.id}
              titulo={subasta.titulo}
              imagen={subasta.imagen}
              precio={subasta.precio_inicial}
              fechafin={subasta.fecha_fin}
            />
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        {selectedSubasta && <SubastaDetails {...selectedSubasta} />}
      </Modal>

      {/* PANEL LATERAL DE CONFIGURACIÓN */}
      {configOpen && (
        <div className="config-overlay" onClick={() => setConfigOpen(false)}>
          <div
            className="config-panel"
            onClick={(e) => e.stopPropagation()}
          >
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
