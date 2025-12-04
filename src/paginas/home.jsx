import CardSubasta from "../componentes/cardSubasta";
import "./home.css";
import Appbar from "../componentes/appbar";
import Modal from "../componentes/model";
import SubastaDetails from "../componentes/subastaDetails";
import searchIcon from "../Assets/tosearch.svg";
import { useState, useEffect, useRef } from "react";
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
  const [userid, setUserId] = useState(null);
  const [subastas, setSubastas] = useState([]);
  const [subastasOriginal, setSubastasOriginal] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const nodeRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const idStored = localStorage.getItem("iduser");
    setUsuario(stored ? JSON.parse(stored) : null);
    setUserId(idStored);
  }, []);

  useEffect(() => {
    cargarSubastas();
  }, []);

  async function cargarSubastas() {
    setLoading(true);
    const response = await fetch("https://tiphonne-api-render.onrender.com/subastas");
    const data = await response.json();

    const formato = data.map((s) => {
      let imagenes = [];

      if (Array.isArray(s.urls_imagenes)) imagenes = s.urls_imagenes;
      else if (typeof s.urls_imagenes === "string") {
        try { imagenes = JSON.parse(s.urls_imagenes); } catch { imagenes = []; }
      }

      return {
        id: s.id_subasta,
        titulo: s.titulo,
        descripcion: s.descripcion,
        imagenes: imagenes,
        imagen: imagenes[0] ?? null,
        precio_inicial: s.puja_actual?.monto ?? s.precio_base,
        precio_base: s.precio_base,
        puja_actual: s.puja_actual,
        fecha_inicio: s.fecha_ini,
        fecha_fin: s.fecha_fin,
        creador: s.id_usuario_creador,
        categorias: s.categoria
      };
    });

    setSubastas(formato);
    setSubastasOriginal(formato);
    setLoading(false);
  }

  const realizarBusqueda = () => {
  const texto = (busqueda || "").toLowerCase();
  const cat = categoria === "" || categoria === "General" ? null : categoria;

  const filtradas = subastasOriginal.filter((s) => {
    const titulo = s.titulo ? s.titulo.toLowerCase() : "";
    const coincideBusqueda = titulo.includes(texto);
    const coincideCategoria = !cat || s.categoria === cat;

    return coincideBusqueda && coincideCategoria;
  });

  setSubastas(filtradas);
};


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
    navigate("/", { replace: true });
  };

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
                  iduser={userid}
                />
              </div>
            ))}
          </div>
        </>
      );
    }

    if (vista === "mis-subastas") {
      const mias = subastasOriginal.filter(
        (s) => s.creador === usuario?.usuario?.id
      );

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
              <p style={{ textAlign: "center", width: "100%" }}>No tienes subastas creadas.</p>
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

  return (
    <>
      <Appbar
        configOpen={configOpen}
        setConfigOpen={setConfigOpen}
        logout={logout}
        user={usuario}
        userid={userid}
      />

      <section className="search-bar">
        <span
          className="search-icon"
          onClick={realizarBusqueda}
          style={{ cursor: "pointer" }}
        >
          <img src={searchIcon} alt="Buscar" />
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
          <option value="">General</option>
          <option value="Hogar">Hogar</option>
          <option value="Electronica">Electronica</option>
          <option value="Artesanias">Artesanias</option>
          <option value="Ropa">Ropa</option>
          <option value="Vehiculos">Vehiculos</option>
          <option value="Cosmeticos">Cosmeticos</option>
        </select>
      </section>

      <nav className="home-nav">
        <div className="nav-box">
          <button
            className={vista === "subastas" ? "active" : ""}
            onClick={() => {
              setVista("subastas");
              setSubastas(subastasOriginal);
            }}
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
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Cargando subastas...</p>
          </div>
        ) : (
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
        )}
      </div>

      <Modal isOpen={isOpen} onClose={handleClose}>
        {selectedSubasta && (
          <SubastaDetails
            id_subasta={selectedSubasta.id}
            titulo={selectedSubasta.titulo}
            descripcion={selectedSubasta.descripcion}
            fecha_ini={selectedSubasta.fecha_inicio}
            fecha_fin={selectedSubasta.fecha_fin}
            precio_base={selectedSubasta.precio_base}
            puja_actual={selectedSubasta.puja_actual}
            imagenes={selectedSubasta.imagenes}
          />
        )}
      </Modal>
    </>
  );
}
