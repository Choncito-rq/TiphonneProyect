import { useEffect, useState } from "react";
import "./crearSubasta.css";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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
    "Salud"
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
      { method: "POST", body: data }
    );

    const json = await res.json();
    if (!json.secure_url) return null;
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
      setCategoriasSeleccionadas(categoriasSeleccionadas.filter(c => c !== cat));
      return;
    }
    if (categoriasSeleccionadas.length >= 4) {
      alert("Máximo 4 categorías");
      return;
    }
    setCategoriasSeleccionadas([...categoriasSeleccionadas, cat]);
  };

  const crearSubasta = async () => {
    if (!descripcion || !precioBase || !fechaFin || !titulo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (categoriasSeleccionadas.length === 0) {
      alert("Debes seleccionar al menos una categoría.");
      return;
    }

    if (imagenesFiles.length === 0) {
      alert("Debes seleccionar al menos una imagen.");
      return;
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
      descripcion: descripcion,
      precio_base: parseFloat(precioBase),
      urls_imgs: urls,
      titulo: titulo,
      categorias: categoriasSeleccionadas.join(",")
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

      await res.json();
      alert("Subasta creada con éxito");

      setImagenesPreview([]);
      setImagenesFiles([]);
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Error al crear la subasta");
    }
  };

  return (
    <section className="perfil-container">
      <button className="btn-back-fixed" onClick={() => navigate(-1)}>
        Volver
      </button>

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

        <div className="grid-2">
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
        </div>

        <div className="input-group">
          <label>Categorías</label>

          <button
            className="btn-categorias"
            onClick={() => setCategoriasOpen(!categoriasOpen)}
          >
            {categoriasOpen ? "Cerrar categorías" : "Seleccionar categorías"}
          </button>

          {categoriasOpen && (
            <div className="categorias-panel">
              {listaCategorias.map((cat) => (
                <div
                  key={cat}
                  className={
                    "categoria-chip " +
                    (categoriasSeleccionadas.includes(cat) ? "chip-activa" : "")
                  }
                  onClick={() => toggleCategoria(cat)}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="input-group">
          <label>Imágenes</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={manejarImagenes}
          />
        </div>

        {imagenesPreview.length > 0 && (
          <div className="image-preview">
            {imagenesPreview.map((img, i) => (
              <div key={i} className="preview-item">
                <img src={img.preview} alt="preview" />
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarImagen(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {subiendo && (
          <p style={{ color: "#6da8ff" }}>Subiendo imágenes...</p>
        )}

        <button className="btn-guardar" onClick={crearSubasta}>
          Crear Subasta
        </button>
      </div>
    </section>
  );
}
