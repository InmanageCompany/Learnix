import NavBar from '../NavBar/NavBar'

function Home() {
  return (
    <>
      <NavBar />
      <div className="container">
        <section className="hero">
          <div className="hero-text">
            <h1>Learnix — Gestión académica rápida y sencilla</h1>
            <h2 style={{ fontStyle: "italic" }}>
              Administrá notas, cursos y alumnos desde una sola plataforma.
            </h2>
            <p>
              Tu plataforma educativa moderna y segura. Accede a tus clases, notas y más desde cualquier dispositivo.
            </p>

            {/* CONTENEDOR DE TARJETAS */}
            <div className="feature-grid">
              <div className="feature-card">
                <h4>Gestión de notas en segundos</h4>
                <p>Subí, modificá y consultá notas sin complicaciones.</p>
              </div>
              <div className="feature-card">
                <h4>Panel de control claro</h4>
                <p>Toda la información académica en un solo lugar.</p>
              </div>
              <div className="feature-card">
                <h4>Roles y permisos</h4>
                <p>Alumnos, profesores y admins con accesos personalizados.</p>
              </div>
              <div className="feature-card">
                <h4>Seguro y moderno</h4>
                <p>Protección de datos + interfaz intuitiva.</p>
              </div>
            </div>
            {/* FIN CARDS */}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;