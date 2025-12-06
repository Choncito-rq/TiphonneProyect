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
  const [subastas, setSubastas] = useState([]);
  const [subastasOriginal, setSubastasOriginal] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const nodeRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUsuario(stored ? JSON.parse(stored) : null);
  }, []);

  useEffect(() => {
    cargarSubastas();
  }, []);
  console.log(usuario);
  function normalizarCategorias(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;

    if (typeof raw === "string") {
      try {
        const json = JSON.parse(raw);
        if (Array.isArray(json)) return json;
      } catch {
        return raw
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c !== "");
      }
    }

    return [];
  }

  async function cargarSubastas() {
    setLoading(true);

    const response = await fetch(
      "https://tiphonne-api-render.onrender.com/subastas"
    );
    const data = await response.json();

    const formato = data.map((s) => {
      let imagenes = [];

      if (Array.isArray(s.urls_imagenes)) imagenes = s.urls_imagenes;
      else if (typeof s.urls_imagenes === "string") {
        try {
          imagenes = JSON.parse(s.urls_imagenes);
        } catch {
          imagenes = [];
        }
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

        categorias: normalizarCategorias(s.categorias),
      };
    });

    setSubastas(formato);
    setSubastasOriginal(formato);
    setLoading(false);
  }

  const realizarBusqueda = () => {
    const texto = (busqueda || "").toLowerCase();
    const cat = categoria === "" || categoria === "Todo" ? null : categoria;

    const filtradas = subastasOriginal.filter((s) => {
      const titulo = s.titulo ? s.titulo.toLowerCase() : "";
      const coincideBusqueda = titulo.includes(texto);
      const coincideCategoria =
        !cat || (s.categorias && s.categorias.includes(cat));
      return coincideBusqueda && coincideCategoria;
    });

    setSubastas(filtradas);

    setCategoria("");
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
    const idUserActual = usuario?.usuario?.id;

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
                  iduser={idUserActual}
                />
              </div>
            ))}
          </div>
        </>
      );
    }

    if (vista === "mis-subastas") {
      const mias = subastasOriginal.filter((s) => s.creador === idUserActual);

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
  };

  return (
    <>
      <Appbar
        configOpen={configOpen}
        setConfigOpen={setConfigOpen}
        logout={logout}
      />

      <section className="search-bar">
        <span className="search-icon" onClick={realizarBusqueda}>
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
          <option value="">Todo</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Hogar">Hogar</option>
          <option value="Electrónica">Electrónica</option>
          <option value="Artesanias">Artesanias</option>
          <option value="Ropa">Ropa</option>
          <option value="Vehículos">Vehículos</option>
          <option value="Coleccionismo">Coleccionismo</option>
          <option value="Deportes">Deportes</option>
          <option value="Arte">Arte</option>
          <option value="Mascotas">Mascotas</option>
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
            id_usuario_creador={selectedSubasta.creador}
            categorias={selectedSubasta.categorias}
          />
        )}
      </Modal>
    </>
  );
}
