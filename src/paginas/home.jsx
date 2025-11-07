import CardSubasta from "../componentes/cardSubasta";
import "./home.css";
import Appbar from "../componentes/appbar";
export default function Home() {
  /*const [subastas, setSubastas] = useState([]);
  useEffect(() => {
    
    // Lógica para obtener las subastas desde el backend
    fetch("https://tu-api.com/subastas")
      .then((res) => res.json())
      .then((data) => setSubastas(data))
      .catch((error) => console.error("Error al cargar subastas:", error));
  }, []);
*/
  return (
    <>
      <Appbar></Appbar>
      <div className="card-container">
        <CardSubasta
          id="1"
          titulo="Perro"
          imagen="https://picsum.photos/400/300"
          precio="234s"
          fechafin="23/2/2025"
        />
        <CardSubasta
          id="1"
          titulo="Perro"
          imagen="https://picsum.photos/400/300"
          precio="234s"
          fechafin="23/2/2025"
        />
        <CardSubasta
          id="1"
          titulo="Perro"
          imagen="https://picsum.photos/400/300"
          precio="234s"
          fechafin="23/2/2025"
        />
        <CardSubasta
          id="1"
          titulo="Perro"
          imagen="https://picsum.photos/400/300"
          precio="234s"
          fechafin="23/2/2025"
        />
        <CardSubasta
          id="1"
          titulo="Perro"
          imagen="https://picsum.photos/400/300"
          precio="234s"
          fechafin="23/2/2025"
        />
        <CardSubasta
          id="1"
          titulo="Perro"
          imagen="https://picsum.photos/400/300"
          precio="234s"
          fechafin="23/2/2025"
        />
        <CardSubasta
          id="1"
          titulo="Perro"
          imagen="https://picsum.photos/400/300"
          precio="234s"
          fechafin="23/2/2025"
        />
        <CardSubasta
          id="1"
          titulo="Perro"
          imagen="https://picsum.photos/400/300"
          precio="234s"
          fechafin="23/2/2025"
        />
      </div>
    </>
  );
}
