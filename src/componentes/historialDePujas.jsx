import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./historialDePujas.css";

export default function MisPujas() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  const [subastas, setSubastas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parse = JSON.parse(localStorage.getItem("user"));
    setUsuario(parse.usuario.id);
    if (!usuario) return;

    const fetchSubastas = async () => {
      try {
        const res = await fetch(
          "https://tiphonne-api-render.onrender.com/subastas"
        );
        const data = await res.json();

        // Filtrar subastas donde el usuario ha pujado
        const participadas = data.filter(
          (s) => s.puja_actual?.id_usuario_pujador === usuario
        );

        setSubastas(participadas);
      } catch (error) {
        console.error("Error cargando subastas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubastas();
  }, [usuario]);

  if (loading) return <p className="loading">Cargando...</p>;

  return (
    <div className="mis-pujas-container">
      <h1 className="titu">Mis Pujas</h1>

      <table className="tabla-pujas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Precio Base</th>
            <th>Mi Puja</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {subastas.map((s) => (
            <tr key={s.id_subasta}>
              <td>{s.id_subasta}</td>
              <td>{s.titulo || "Sin título"}</td>
              <td>{s.descripcion}</td>
              <td>${s.precio_base}</td>
              <td>${s.puja_actual?.monto || "—"}</td>
              <td>{new Date(s.fecha_ini).toLocaleString()}</td>
              <td>{new Date(s.fecha_fin).toLocaleString()}</td>
              <td className={s.estado === 1 ? "activa" : "inactiva"}>
                {s.estado === 1 ? "Activa" : "Finalizada"}
              </td>
            </tr>
          ))}

          {subastas.length === 0 && (
            <tr>
              <td colSpan="9" className="sin-registros">
                No has participado en ninguna subasta aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
