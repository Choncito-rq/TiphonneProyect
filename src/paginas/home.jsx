import CardSubasta from "../componentes/cardSubasta";
import "./home.css";
import Appbar from "../componentes/appbar";
import Modal from "../componentes/model";
import SubastaDetails from "../componentes/subastaDetails";
import { useState, useEffect, useRef } from "react"; // ← FALTABA useRef
import { useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubasta, setSelectedSubasta] = useState(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState("subastas");
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");

  const [subastas, setSubastas] = useState([]);
  const [subastasOriginal, setSubastasOriginal] = useState([]); // ← Para no perder las originales

  const nodeRef = useRef(null);
  const navigate = useNavigate();

  // Cargar usuario
  useEffect(() => {
    const stored = localStorage.getItem("user");
    const userParsed = stored ? JSON.parse(stored) : null;
    setUsuario(userParsed);
  }, []);

  // Cargar subastas
  useEffect(() => {
    cargarSubastas();
  }, []);

  async function cargarSubastas() {
    const response = await fetch(
      "https://tiphonne-api-render.onrender.com/subastas"
    );
    const data = await response.json();

    const formato = data.map((s) => ({
      id: s.id_subasta,
      titulo: s.descripcion,
      descripcion: s.descripcion,
      imagenes: s.imagenes ?? [],
      imagen: s.imagenes?.[0] ?? null,
      precio_inicial: s.puja_actual?.monto ?? s.precio_base,
      precio_base: s.precio_base,
      puja_actual: s.puja_actual,
      fecha_inicio: s.fecha_ini,
      fecha_fin: s.fecha_fin,
      creador: s.id_usuario_creador,
    }));

    setSubastas(formato);
    setSubastasOriginal(formato); // ← Guardar copia original
  }

  // BUSCADOR
  const realizarBusqueda = () => {
    const filtradas = subastasOriginal.filter((s) => {
      const coincideBusqueda = s.titulo
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      // no existe "categoria" en API
      const coincideCategoria = categoria === "";

      return coincideBusqueda && coincideCategoria;
    });

    setSubastas(filtradas);
  };

  // ABRIR MODAL
  const handleOpen = (subasta) => {
    setSelectedSubasta(subasta);
    setIsOpen(true);
  };

  // CERRAR MODAL
  const handleClose = () => {
    setSelectedSubasta(null);
    setIsOpen(false);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  // VISTAS
  const renderVista = () => {
    // Vista SUBASTAS
    if (vista === "subastas") {
      return (
        <>
          <section className="home-header">
            <h1>Subastas Disponibles</h1>
            <p>Explora artículos interesantes y participa en pujas activas.</p>
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

    // Vista MIS SUBASTAS
    if (vista === "mis-subastas") {
      const creadorId = usuario?.usuario?.id;

      const mias = subastasOriginal.filter((s) => s.creador == creadorId);

      return (
        <>
          <section className="home-header">
            <h1>Tus Subastas</h1>
            <p>Subastas creadas por ti.</p>
          </section>

          <div className="card-container">
            {mias.length === 0 && <p>No tienes subastas creadas.</p>}

            {mias.map((subasta) => (
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

    // Vista MIS PUJAS (futuro)
    if (vista === "mis-pujas") {
      return (
        <section className="home-header">
          <h1>Mis Pujas</h1>
          <p>Aquí aparecen subastas donde participas.</p>
        </section>
      );
    }
  };

  return (
    <>
      <Appbar
        configOpen={configOpen}
        setConfigOpen={setConfigOpen}
        logout={logout}
        user={usuario}
      />

      {/* BARRA DE BUSQUEDA */}
      <section className="search-bar">
        <span className="search-icon" onClick={realizarBusqueda}>
          🔍
        </span>

        <input
          type="text"
          placeholder="Buscar..."
          className="search-input"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && realizarBusqueda()}
        />

        <select
          className="filter-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">GENERAL</option>
          <option value="Hogar">HOGAR</option>
          <option value="Electronica">ELECTRONICA</option>
          <option value="Artesanias">ARTESANIAS</option>
          <option value="Ropa">ROPA</option>
          <option value="Vehiculos">VEHICULOS</option>
        </select>
      </section>

      {/* NAV */}
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

      {/* ANIMACIÓN */}
      <div className="home-content">
        <SwitchTransition>
          <CSSTransition
            key={vista}
            timeout={300}
            classNames="fade"
            nodeRef={nodeRef}
            unmountOnExit
          >
            <div ref={nodeRef} className="vista fade-content">
              {renderVista()}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        {selectedSubasta && (
          <SubastaDetails
            {...selectedSubasta}
            imagenes={selectedSubasta.imagenes ?? []}
          />
        )}
      </Modal>
    </>
  );
}
