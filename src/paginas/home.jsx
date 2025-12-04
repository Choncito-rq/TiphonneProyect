import CardSubasta from "../componentes/cardSubasta";
import "./home.css";
import Appbar from "../componentes/appbar";
import Modal from "../componentes/model";
import SubastaDetails from "../componentes/subastaDetails";
import { useState, useEffect } from "react";
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

  const navigate = useNavigate();

  // ===============================
  // CARGAR USUARIO
  // ===============================
  useEffect(() => {
    const stored = localStorage.getItem("user");
    const userParsed = stored ? JSON.parse(stored) : null;
    setUsuario(userParsed);
  }, []);

  // ===============================
  // CARGAR SUBASTAS
  // ===============================
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
      categoria: s.categoria ?? "",
    }));

    setSubastas(formato);
  }

  // ===============================
  // FUNCIÓN DE BÚSQUEDA
  // ===============================
  const realizarBusqueda = () => {
    const filtradas = subastas.filter((s) => {
      const coincideBusqueda = s.titulo
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoria === "" || s.categoria === categoria;

      return coincideBusqueda && coincideCategoria;
    });

    setSubastas(filtradas);
  };

  // ===============================
  // MODAL DE DETALLES
  // ===============================
  const handleOpen = (subasta) => {
    setSelectedSubasta(subasta);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedSubasta(null);
    setIsOpen(false);
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  // ===============================
  // RENDER DE VISTAS
  // ===============================
  const renderVista = () => {
    if (vista === "subastas") {
      return (
        <>
          <section className="home-header">
            <div>
              <h1>Subastas Disponibles</h1>
              <p>Explora artículos interesantes y participa en pujas activas.</p>
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
      const mias = subastas.filter((s) => s.creador === usuario?.id);

      return (
        <>
          <section className="home-header">
            <div>
              <h1>Tus Subastas</h1>
              <p>Subastas creadas por ti.</p>
            </div>
          </section>

          <div className="card-container">
            {mias.length === 0 ? (
              <p style={{ textAlign: "center", width: "100%" }}>
                No tienes subastas creadas.
              </p>
            ) : (
              mias.map((subasta) => (
                <div key={subasta.id} onClick={() => handleOpen(subasta)}>
                  <CardSubasta
                    id={subasta.id}
                    titulo={subasta.titulo}
                    imagen={subasta.imagen}
                    precio={subasta.precio_inicial}
                    fechafin={subasta.fecha_fin}
                  />
                </div>
              ))
            )}
          </div>
        </>
      );
    }

    if (vista === "mis-pujas") {
      return (
        <section className="home-header">
          <h1>Mis Pujas</h1>
          <p>Aquí aparecen subastas donde participas.</p>
        </section>
      );
    }
  };

  // ===============================
  // RENDER PRINCIPAL
  // ===============================
  return (
    <>
      <Appbar
        configOpen={configOpen}
        setConfigOpen={setConfigOpen}
        logout={logout}
        user={usuario}
      />

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <section className="search-bar">
        <span
          className="search-icon"
          onClick={realizarBusqueda}
          style={{ cursor: "pointer" }}
        >
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

      {/* NAVEGACIÓN */}
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
          >
            <div className="vista fade-content">{renderVista()}</div>
          </CSSTransition>
        </SwitchTransition>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        {selectedSubasta && (
          <SubastaDetails
            {...selectedSubasta}
            imagenes={selectedSubasta?.imagenes ?? []}
          />
        )}
      </Modal>
    </>
  );
}
