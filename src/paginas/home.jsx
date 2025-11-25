import CardSubasta from "../componentes/cardSubasta";
import "./home.css";
import Appbar from "../componentes/appbar";
import Modal from "../componentes/model";
import SubastaDetails from "../componentes/subastaDetails";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubasta, setSelectedSubasta] = useState(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [vista, setVista] = useState("subastas");

  const navigate = useNavigate();

  // 🔥 Referencia para que react-transition-group NO use findDOMNode
  const nodeRef = useRef(null);

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

  // ---------- CONTENIDO SEGÚN VISTA ----------
  const renderVista = () => {
    if (vista === "subastas") {
      return (
        <>
          <section className="home-header">
            <div>
              <h1>Subastas Disponibles</h1>
              <p>
                Explora artículos interesantes y participa en pujas activas.
              </p>
            </div>
          </section>

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
        </>
      );
    }

    if (vista === "mis-subastas") {
      return (
        <section>
          <section className="home-header">
            <div>
              <h1>Tus Subastas</h1>
              <p>Subastas que has creado</p>
            </div>
          </section>
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
        </section>
      );
    }

    if (vista === "mis-pujas") {
      return (
        <div className="card-container">
          <h1>Mis Pujas</h1>
          <p>Aqui aparecen subastas que estas participando</p>
        </div>
      );
    }
  };

  return (
    <>
      <Appbar
        configOpen={configOpen}
        setConfigOpen={setConfigOpen}
        user={user}
      />

      <nav className="home-nav">
        <div className="nav-box">
          <button
            className={vista === "subastas" ? "active" : ""}
            onClick={() => setVista("subastas")}
          >
            Subastas
          </button>

          <button
            className={vista === "mis-subastas" ? "active" : ""}
            onClick={() => setVista("mis-subastas")}
          >
            Mis Subastas
          </button>

          <button
            className={vista === "mis-pujas" ? "active" : ""}
            onClick={() => setVista("mis-pujas")}
          >
            Mis Pujas
          </button>
        </div>
      </nav>

      <div className="home-content">
        <SwitchTransition>
          <CSSTransition
            key={vista}
            timeout={300}
            classNames="fade"
            unmountOnExit
            nodeRef={nodeRef}
          >
            <div ref={nodeRef} className="vista fade-content">
              {renderVista()}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose}>
        {selectedSubasta && <SubastaDetails {...selectedSubasta} />}
      </Modal>
    </>
  );
}
