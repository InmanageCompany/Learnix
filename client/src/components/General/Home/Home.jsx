import NavBar from '../NavBar/NavBar'
import './Home.css'

function Home() {
  return (
    <>
      <NavBar />

      <section className="hero">
        <h1>Learnix — Gestión académica rápida y sencilla</h1>

        <p className="sub">
          Administrá notas, cursos y alumnos desde una sola plataforma.
        </p>

        <p className="desc">
          Tu plataforma educativa moderna y segura. Accede a tus clases, notas y más desde cualquier dispositivo.
        </p>
      </section>

      {/* SECCIÓN DE CARDS */}
      <section className="features">
        <div className="feature-card">
          <h3>Gestión de notas en segundos</h3>
          <p>Subí, modificá y consultá notas sin complicaciones.</p>
        </div>

        <div className="feature-card">
          <h3>Panel de control claro</h3>
          <p>Toda la información académica en un solo lugar.</p>
        </div>

        <div className="feature-card">
          <h3>Roles y permisos</h3>
          <p>Alumnos, profesores y admins con accesos personalizados.</p>
        </div>

        <div className="feature-card">
          <h3>Seguro y moderno</h3>
          <p>Protección de datos + interfaz intuitiva.</p>
        </div>
      </section>

      <footer>
        © 2025 Learnix — Desarrollado por Inmanage | <a href="/">Volver al inicio</a>
      </footer>
    </>
  );
}

export default Home;