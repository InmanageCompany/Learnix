
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Login.css";
import logoLearnix from "../../../assets/logo-learnix1.png";
import fondoClase from "../../../assets/fondo-clase.jpg";

function LoginStudent() {
  const [cuil, setCuil] = useState("");
  const [tuition, setTuition] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        {
          cuil: Number(cuil),
          tuition: Number(tuition),
        }
      );

      const { token, role } = response.data;

      if (!token || !role) {
        alert("La respuesta del servidor no contiene los datos necesarios.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      navigate("/student/home");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "No se pudo iniciar sesión.");
      } else if (error.request) {
        alert("No hay respuesta del servidor. Verificá la conexión.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
        className="student-login-page"
        style={{ "--login-bg": `url("${fondoClase}")` }}
      >
      <section className="login-presentation">
      <button
        type="button"
        className="student-login-brand"
        onClick={() => navigate("/")}
        aria-label="Volver al inicio"
      >
        <img src={logoLearnix} alt="Learnix" />
        
      </button>
      <div className="login-presentation-content">
          <h1>Tu espacio educativo, siempre disponible.</h1>

          <p>
            Accedé a la información de forma sencilla,
            organizada y desde cualquier dispositivo.
          </p>

          <div className="login-benefits">
            <article>
              <strong>Gestión académica</strong>
              <span>Información organizada.</span>
            </article>

            <article>
              <strong>Comunidad educativa</strong>
              <span>Todo en un solo lugar.</span>
            </article>

            <article>
              <strong>Acceso seguro</strong>
              <span>Información personalizada.</span>
            </article>
          </div>
        </div>
        </section>


     <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-form-heading">
          <h1>Iniciar sesión como Estudiante</h1>
          <p>Ingresá a tu cuenta para continuar en Learnix.</p>
        </div>

        <form className="student-login-form" onSubmit={fetchLogin}>
          <label htmlFor="student-cuil">Cuil</label>
          <input
            id="student-cuil"
            name="cuil"
            type="text"
            inputMode="numeric"
            placeholder="Ingresá tu CUIL"
            value={cuil}
            onChange={(e) => setCuil(e.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="student-tuition">Matrícula</label>
          <input
            id="student-tuition"
            name="tuition"
            type="text"
            inputMode="numeric"
            placeholder="Ingresá tu matrícula"
            value={tuition}
            onChange={(e) => setTuition(e.target.value)}
            autoComplete="off"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disableElevation
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.1,
              borderRadius: "7px",
              backgroundColor: "#159de0",
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": { backgroundColor: "#1189c5" },
            }}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>

        <button
          type="button"
          className="student-login-home"
          onClick={() => navigate("/")}
        >
          <ArrowBackIcon fontSize="small" />
          Volver al inicio
        </button>
      </div>
      </section>
    </main>
  );
}

export default LoginStudent;
