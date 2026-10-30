import { useNavigate } from "react-router-dom";
import "./Home.css";
import fondoClase from "../../../assets/fondo-clase.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <section
        className="hero"
        style={{ backgroundImage: `url(${fondoClase})` }}
      >
        <div className="hero-text">
          <p className="eyebrow">
            Learnix — Gestión académica rápida y sencilla
          </p>

          <h1>
            Administrá notas, cursos y alumnos desde una sola plataforma.
          </h1>

          <p className="desc">
            Accedé a la información académica de forma sencilla,
            organizada y desde cualquier dispositivo.
          </p>

          <div className="features">
            <article className="feature-card">
              <h4>Gestión de notas</h4>
              <p>
                Cargá, modificá y consultá calificaciones de manera sencilla.
              </p>
            </article>

            <article className="feature-card">
              <h4>Información académica</h4>
              <p>
                Encontrá la información de cursos y alumnos en un solo lugar.
              </p>
            </article>

            <article className="feature-card">
              <h4>Accesos personalizados</h4>
              <p>
                Cada usuario cuenta con herramientas según su perfil.
              </p>
            </article>

            <article className="feature-card">
              <h4>Una comunidad conectada</h4>
              <p>
                Facilitá la organización y el seguimiento de la actividad escolar.
              </p>
            </article>
          </div>

          <div className="home-actions">
            <button
              type="button"
              className="home-btn home-btn-primary"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              className="home-btn home-btn-primary"
              onClick={() => navigate("/student/login")}
            >
              Acceder como estudiante
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
