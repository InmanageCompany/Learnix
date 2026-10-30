
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Login.css";
import logoLearnix from "../../../assets/logo-learnix1.png";
import fondoClase from "../../../assets/fondo-clase.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        { email, password }
      );

      const { token, role } = response.data;

      if (!token || !role) {
        alert("La respuesta del servidor no contiene los datos necesarios.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") navigate("/admin/home");
      else if (role === "teacher") navigate("/teacher/home");
      else if (role === "rector") navigate("/rector/home");
      else alert("Rol no reconocido.");
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
      className="login-page"
      style={{ "--login-bg": `url("${fondoClase}")` }}
    >
      <section className="login-presentation">
        <button
          type="button"
          className="login-brand"
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
            <h2>Iniciar sesión</h2>
            <p>Ingresá a tu cuenta para continuar en Learnix.</p>
          </div>

          <form className="login-form" onSubmit={fetchLogin}>
            <label htmlFor="login-email">Correo</label>
            <input
              id="login-email"
              type="email"
              placeholder="Ingresá tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />

            <label htmlFor="login-password">Contraseña</label>
            <div className="login-password-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>

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
            className="login-back"
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

export default Login;
