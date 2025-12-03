import { useState } from "react";
import "./crearSubasta.css";

export default function CrearSubasta() {
  const [descripcion, setDescripcion] = useState("");
  const [precioBase, setPrecioBase] = useState("");
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [imagenesPreview, setImagenesPreview] = useState([]);
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [titulo, setTitulo] = useState("");

  // ============================================================
  //               FUNCIÓN DE SUBIDA A CLOUDINARY
  // ============================================================
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);

    // 🔥 CREDENCIALES 🔥
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

  // ============================================================
  //               MANEJO DE IMÁGENES LOCAL
  // ============================================================
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

  // ============================================================
  //               CREAR SUBASTA (SUBIR IMÁGENES)
  // ============================================================
  const crearSubasta = async () => {
    if (!descripcion || !precioBase || !fechaIni || !fechaFin) {
      return alert("Todos los campos son obligatorios.");
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
      descripcion,
      precio_base: precioBase,
      fecha_ini: fechaIni,
      fecha_fin: fechaFin,
      imagenes: urls,
      id_usuario_creador: 1,
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
            <label>Fecha inicio</label>
            <input
              type="datetime-local"
              value={fechaIni}
              onChange={(e) => setFechaIni(e.target.value)}
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

        {/* CARGA DE IMÁGENES */}
        <div className="input-group">
          <label>Imágenes</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={manejarImagenes}
          />
        </div>

        {/* PREVIEW */}
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

        {subiendo && <p style={{ color: "#6da8ff" }}>Subiendo imágenes...</p>}

        <button className="btn-guardar" onClick={crearSubasta}>
          Crear Subasta
        </button>
      </div>
    </section>
  );
}
