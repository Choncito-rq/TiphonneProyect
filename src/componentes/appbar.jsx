import "./appbar.css";
export default function Appbar() {
  return (
    <header className="appbar">
      <h1 className="logo">Tiphonne</h1>
      <nav>
        <a href="/perfil">Perfil</a>
        <a href="/config">Configuración</a>
      </nav>
    </header>
  );
}
