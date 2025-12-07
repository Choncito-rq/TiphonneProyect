import { useState, useEffect } from "react";
import "./subastaDetails.css";

export default function SubastaDetails({
  id_subasta,
  descripcion,
  titulo,
  fecha_ini,
  fecha_fin,
  precio_base,
  puja_actual,
  imagenes = [],
  id_usuario_creador,
  categorias = [],
}) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [monto, setMonto] = useState("");
  const [imagenActual, setImagenActual] = useState(
    imagenes[0] || "https://picsum.photos/400/300"
  );

  const [modoEdicion, setModoEdicion] = useState(false);

  const [tituloEdit, setTituloEdit] = useState(titulo);
  const [descripcionEdit, setDescripcionEdit] = useState(descripcion);
  const [precioBaseEdit, setPrecioBaseEdit] = useState(precio_base);
  const [fechaFinEdit, setFechaFinEdit] = useState(fecha_fin);

  const [categoriasEdit, setCategoriasEdit] = useState(categorias);

  const [imagenesEdit, setImagenesEdit] = useState(imagenes);
  const [imagenesPreview, setImagenesPreview] = useState([]);
  const [imagenesFiles, setImagenesFiles] = useState([]);

  const [subiendo, setSubiendo] = useState(false);

  const listaCategorias = [
    "Tecnología",
    "Hogar",
    "Electrónica",
    "Artesanias",
    "Vehículos",
    "Ropa",
    "Arte",
    "Mascotas",
    "Coleccionismo",
    "Deportes",
    "Juguetes",
    "Salud",
  ];

  const user = JSON.parse(localStorage.getItem("user"));
  const idUser = user?.usuario?.id;

  const esDuenioDeLaPuja = puja_actual?.id_usuario_pujador === idUser;
  const esDuenioDeLaSubasta = id_usuario_creador === idUser;

  // TIEMPO RESTANTE
  const [tiempoRestante, setTiempoRestante] = useState("");

  const calcularTiempoRestante = () => {
    const fin = new Date(fecha_fin).getTime();
    const ahora = Date.now();
    const diferencia = fin - ahora;

    if (diferencia <= 0) return "Finalizada";

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  };

  useEffect(() => {
    setTiempoRestante(calcularTiempoRestante());
    const interval = setInterval(() => {
      setTiempoRestante(calcularTiempoRestante());
    }, 1000);
    return () => clearInterval(interval);
  }, [fecha_fin]);

  const toggleCategoria = (cat) => {
    if (categoriasEdit.includes(cat)) {
      setCategoriasEdit(categoriasEdit.filter((c) => c !== cat));
      return;
    }

    if (categoriasEdit.length >= 4) {
      const nuevas = [...categoriasEdit];
      nuevas.pop(); // Quita la última
      nuevas.push(cat); // Añade la nueva
      setCategoriasEdit(nuevas);
      return;
    }

    setCategoriasEdit([...categoriasEdit, cat]);
  };

  const manejarImagenes = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImagenesPreview((prev) => [...prev, ...previews]);
    setImagenesFiles((prev) => [...prev, ...files]);
  };

  const eliminarImagenActual = (index) => {
    setImagenesEdit(imagenesEdit.filter((_, i) => i !== index));
  };

  const eliminarImagenNueva = (index) => {
    setImagenesPreview(imagenesPreview.filter((_, i) => i !== index));
    setImagenesFiles(imagenesFiles.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "preset_publico");
    data.append("folder", "subastas");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dqjwp748k/image/upload",
      { method: "POST", body: data }
    );

    const json = await res.json();
    return json.secure_url || null;
  };

  const handleGuardarCambios = async () => {
    try {
      setSubiendo(true);

      const nuevasUrls = [];
      for (let file of imagenesFiles) {
        const url = await uploadImage(file);
        if (url) nuevasUrls.push(url);
      }

      setSubiendo(false);

      const todasLasImagenes = [...imagenesEdit, ...nuevasUrls];

      const response = await fetch(
        `https://tiphonne-api-render.onrender.com/subastas/${id_subasta}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: idUser,
            titulo: tituloEdit,
            descripcion: descripcionEdit,
            precio_base: precioBaseEdit,
            fecha_fin: fechaFinEdit,
            categorias: categoriasEdit,
            url_imgs: todasLasImagenes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al actualizar la subasta");
        return;
      }

      alert("Subasta actualizada correctamente");
      setModoEdicion(false);
      window.location.reload();
    } catch (e) {
      alert("Error al guardar los cambios");
    }
  };

  const handlePujar = async () => {
    if (esDuenioDeLaSubasta)
      return alert("No puedes pujar en tu propia subasta.");
    if (esDuenioDeLaPuja) return alert("No puedes superar tu propia oferta.");
    if (!monto || Number(monto) <= (puja_actual?.monto ?? precio_base))
      return alert("La puja debe ser mayor a la actual.");

    try {
      const response = await fetch(
        `https://tiphonne-api-render.onrender.com/subastas/${id_subasta}/pujas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: idUser,
            puja: monto,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Error al realizar la puja");
        setMostrarModal(false);
        return;
      }

      alert("Puja realizada correctamente");
      setMostrarModal(false);
      window.location.reload();
    } catch (error) {
      alert("Error al pujar");
    }
  };

  return (
    <>
      <article className="auction-details">
        <div className="auction-left">
          <img
            className="main-image"
            src={imagenActual}
            alt="Imagen principal"
          />

          <div className="image-thumbs">
            {imagenesEdit.map((img, i) => (
              <div key={i} className="thumb-wrapper">
                <img
                  src={img}
                  alt="mini"
                  className="thumb-img"
                  onClick={() => setImagenActual(img)}
                />
                {modoEdicion && (
                  <button
                    className="btn-eliminar-mini"
                    onClick={() => eliminarImagenActual(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {modoEdicion && imagenesPreview.length > 0 && (
            <div className="image-preview">
              {imagenesPreview.map((img, i) => (
                <div key={i} className="preview-item">
                  <img src={img.preview} alt="preview" />
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarImagenNueva(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {modoEdicion && (
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={manejarImagenes}
            />
          )}
        </div>

        <div className="auction-right">
          {esDuenioDeLaSubasta && !modoEdicion && (
            <button
              className="primary-btn"
              onClick={() => setModoEdicion(true)}
            >
              Editar subasta
            </button>
          )}

          {modoEdicion && (
            <>
              <button className="save-btn" onClick={handleGuardarCambios}>
                Guardar cambios
              </button>
              <button
                className="secondary-btn"
                onClick={() => setModoEdicion(false)}
              >
                Cancelar
              </button>
            </>
          )}

          <p className="time-left">
            Tiempo restante: <span>{tiempoRestante}</span>
          </p>

          {modoEdicion ? (
            <input
              className="editable-input"
              value={tituloEdit}
              onChange={(e) => setTituloEdit(e.target.value)}
            />
          ) : (
            <h2>{titulo}</h2>
          )}

          <h4>Categorías:</h4>

          {modoEdicion ? (
            <div className="categorias-panel">
              {listaCategorias.map((cat) => (
                <div
                  key={cat}
                  className={`categoria-chip ${
                    categoriasEdit.includes(cat) ? "chip-activa" : ""
                  }`}
                  onClick={() => toggleCategoria(cat)}
                >
                  {cat}
                </div>
              ))}
            </div>
          ) : (
            <div className="categoria-list">
              {categorias.map((c, i) => (
                <span key={i} className="categoria-item">
                  {c}
                </span>
              ))}
            </div>
          )}

          <p className="current-bid">
            Puja actual: <span>{puja_actual?.monto ?? precio_base}</span>
          </p>
          {esDuenioDeLaPuja && (
            <p
              style={{
                color: "limegreen",
                fontWeight: "bold",
                marginTop: "5px",
              }}
            >
              Eres dueño de la puja actual
            </p>
          )}
          {modoEdicion && (
            <>
              <label>Precio base</label>
              <input
                type="number"
                className="editable-input"
                value={precioBaseEdit}
                onChange={(e) => setPrecioBaseEdit(e.target.value)}
              />
            </>
          )}

          {modoEdicion ? (
            <textarea
              className="editable-textarea"
              value={descripcionEdit}
              onChange={(e) => setDescripcionEdit(e.target.value)}
            />
          ) : (
            <p className="description">{descripcion}</p>
          )}

          {modoEdicion ? (
            <div className="input-group">
              <label>Fecha fin</label>
              <input
                type="datetime-local"
                value={fechaFinEdit}
                onChange={(e) => setFechaFinEdit(e.target.value)}
              />
            </div>
          ) : (
            <p className="dates">
              <span>Inicio:</span> {fecha_ini} <br />
              <span>Fin:</span> {fecha_fin}
            </p>
          )}

          {!esDuenioDeLaPuja && !esDuenioDeLaSubasta && (
            <div className="bid-actions">
              <button
                className="primary-btn"
                onClick={() => setMostrarModal(true)}
              >
                Pujar
              </button>
              <button className="secondary-btn">Historial</button>
            </div>
          )}
        </div>
      </article>

      {mostrarModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Realizar puja</h3>

            <input
              type="number"
              min="1"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ingresa tu oferta"
            />

            <button className="primary-btn" onClick={handlePujar}>
              Confirmar
            </button>
            <button
              className="secondary-btn"
              onClick={() => setMostrarModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {subiendo && (
        <p style={{ color: "#6da8ff", marginTop: 10 }}>Subiendo imágenes...</p>
      )}
    </>
  );
}
