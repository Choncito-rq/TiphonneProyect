export default function Appbar() {
  return (
    <header className="appbar">
      <h1 className="logo">Mi App</h1>
      <nav>
        <a href="/">Inicio</a>
        <a href="/perfil">Perfil</a>
        <a href="/config">Configuración</a>
      </nav>
    </header>
  );
}
