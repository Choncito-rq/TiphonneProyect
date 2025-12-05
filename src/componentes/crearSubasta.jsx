import { useEffect, useState } from "react";
import "./crearSubasta.css";

export default function CrearSubasta() {
  const [descripcion, setDescripcion] = useState("");
  const [precioBase, setPrecioBase] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [imagenesPreview, setImagenesPreview] = useState([]);
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [usuario, setUsuario] = useState(null);

  const [categoriasOpen, setCategoriasOpen] = useState(false);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

  const listaCategorias = [
    "Hogar",
    "Electrónica",
    "Artesanías",
    "Ropa",
    "Vehículos",
    "Cosméticos",
    "Joyería",
    "Deportes",
    "Mascotas",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;
    setUsuario(parsed);
  }, []);

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "preset_publico");
    data.append("folder", "subastas");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dqjwp748k/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();
    if (!json.secure_url) {
      console.error("Error subiendo a Cloudinary:", json);
      return null;
    }

    return json.secure_url;
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

  const eliminarImagen = (index) => {
    setImagenesPreview((prev) => prev.filter((_, i) => i !== index));
    setImagenesFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCategoria = (cat) => {
    if (categoriasSeleccionadas.includes(cat)) {
      setCategoriasSeleccionadas((prev) => prev.filter((c) => c !== cat));
      return;
    }

    if (categoriasSeleccionadas.length >= 4) {
      alert("Máximo 4 categorías.");
      return;
    }

    setCategoriasSeleccionadas((prev) => [...prev, cat]);
  };

  const crearSubasta = async () => {
    if (!descripcion || !precioBase || !fechaFin || !titulo) {
      return alert("Todos los campos son obligatorios.");
    }

    if (categoriasSeleccionadas.length === 0) {
      return alert("Selecciona al menos una categoría.");
    }

    if (imagenesFiles.length === 0) {
      return alert("Debes seleccionar al menos una imagen.");
    }

    setSubiendo(true);

    const urls = [];
    for (let file of imagenesFiles) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }

    setSubiendo(false);

    const data = {
      id_usuario: usuario.usuario.id,
      fecha_fin: fechaFin,
      descripcion,
      precio_base: precioBase,
      urls_imgs: urls,
      titulo,
      categorias: categoriasSeleccionadas,
    };

    try {
      const res = await fetch(
        "https://tiphonne-api-render.onrender.com/subastas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const json = await res.json();
      console.log("Subasta creada:", json);
      alert("Subasta creada con éxito");

      setImagenesPreview([]);
      setImagenesFiles([]);
      setCategoriasSeleccionadas([]);
    } catch (error) {
      console.error(error);
      alert("Error al crear la subasta");
    }
  };

  return (
    <section className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <h2>Crear Subasta</h2>
        </div>

        <div className="input-group">
          <label>Título de la subasta</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Descripción</label>
          <textarea
            className="textarea-dark"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>

        <div className="input-group">
          <label>Precio base</label>
          <input
            type="number"
            value={precioBase}
            onChange={(e) => setPrecioBase(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Fecha fin</label>
          <input
            type="datetime-local"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Categorías</label>
          <button
            className="btn-categorias"
            onClick={() => setCategoriasOpen(!categoriasOpen)}
          >
            {categoriasOpen ? "Cerrar categorías" : "Seleccionar categorías"}
          </button>
        </div>

        {categoriasOpen && (
          <div className="categoria-card">
            {listaCategorias.map((cat, i) => (
              <span
                key={i}
                className={
                  categoriasSeleccionadas.includes(cat)
                    ? "cat-tag selected"
                    : "cat-tag"
                }
                onClick={() => toggleCategoria(cat)}
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="selected-cat-box">
          {categoriasSeleccionadas.map((c, i) => (
            <span key={i} className="cat-tag selected small">
              {c}
            </span>
          ))}
        </div>

        <div className="input-group">
          <label>Imágenes</label>
          <input type="file" accept="image/*" multiple onChange={manejarImagenes} />
        </div>

        {imagenesPreview.length > 0 && (
          <div className="image-preview">
            {imagenesPreview.map((img, i) => (
              <div key={i} className="preview-item">
                <img src={img.preview} alt="preview" />
                <button className="btn-eliminar" onClick={() => eliminarImagen(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {subiendo && <p style={{ color: "#6da8ff" }}>Subiendo imágenes...</p>}

        <button className="btn-guardar" onClick={crearSubasta}>
          Crear Subasta
        </button>
      </div>
    </section>
  );
}
