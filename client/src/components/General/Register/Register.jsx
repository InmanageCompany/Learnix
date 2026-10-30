import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./../Login/Login.css";
import "./Register.css";
import logoLearnix from "../../../assets/logo-learnix1.png";

function Register() {
  const [name, setName] = useState("");
  const [date_of_birth, setDate_of_birth] = useState("");
  const [phone, setPhone] = useState("");
  const [cuil, setCuil] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [school_id, setSchool_id] = useState("");
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/schools"
        );

        setSchools(response.data);
      } catch (error) {
        alert("No se pudieron cargar las escuelas.");
      }
    };

    fetchSchools();
  }, []);

  const fetchRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      !name.trim() ||
      !date_of_birth ||
      !phone.trim() ||
      !cuil.trim() ||
      !email.trim() ||
      !password ||
      !school_id
    ) {
      alert("Por favor, completá todos los campos obligatorios.");
      return;
    }

    const cleanCuil = cuil.replace(/\D/g, "");
    const cleanPhone = phone.replace(/\D/g, "");

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/teacher/register",
        {
          name: name.trim(),
          school_id,
          date_of_birth,
          phone: cleanPhone,
          cuil: cleanCuil,
          email: email.trim(),
          password,
        }
      );

      alert("Registro completado correctamente.");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.message ||
            "No se pudo completar el registro."
        );
      } else if (error.request) {
        alert("No hay respuesta del servidor.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page register-page">
      <section className="login-presentation">
        <button
          type="button"
          className="login-brand"
          onClick={() => navigate("/")}
          aria-label="Volver al inicio de Learnix"
        >
          <img
            src={logoLearnix}
            alt=""
            className="login-brand-logo"
          />

          <span>
            <strong>LEARNIX</strong>
          </span>
        </button>

        <div className="login-presentation-content">
          <span className="login-eyebrow">
            GESTIÓN ACADÉMICA RÁPIDA Y SENCILLA
          </span>

          <h1>Sumate a la comunidad educativa de Learnix.</h1>

          <p>
            Creá tu cuenta para acceder a una plataforma pensada
            para organizar y facilitar la gestión académica.
          </p>

          <div className="login-benefits">
            <article>
              <MenuBookOutlinedIcon />
              <h3>Organización</h3>
              <p>Información académica en un solo lugar.</p>
            </article>

            <article>
              <GroupsOutlinedIcon />
              <h3>Comunidad</h3>
              <p>Conectá con tu institución educativa.</p>
            </article>

            <article>
              <SecurityOutlinedIcon />
              <h3>Acceso personalizado</h3>
              <p>Tu cuenta para continuar en Learnix.</p>
            </article>
          </div>
        </div>

        <span className="login-signature"></span>
      </section>

      <section className="login-form-section register-form-section">
        <div className="login-form-wrapper register-form-wrapper">
          <div className="login-form-heading">

            <h2>Crear cuenta</h2>

            <p>
              Completá tus datos para registrarte en Learnix.
            </p>
          </div>

          <form
            className="login-form register-form"
            onSubmit={fetchRegister}
          >
            <label htmlFor="register-name">
              Nombre completo
            </label>

            <input
              id="register-name"
              type="text"
              placeholder="Ingresá tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />

            <label htmlFor="register-school">
              Institución educativa
            </label>

            <select
              id="register-school"
              value={school_id}
              onChange={(e) => setSchool_id(e.target.value)}
              required
            >
              <option value="">Seleccioná una escuela</option>

              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>

            <label htmlFor="register-birth">
              Fecha de nacimiento
            </label>

            <input
              id="register-birth"
              type="date"
              value={date_of_birth}
              onChange={(e) => setDate_of_birth(e.target.value)}
              autoComplete="bday"
              required
            />

            <label htmlFor="register-phone">
              Teléfono
            </label>

            <input
              id="register-phone"
              type="tel"
              placeholder="Ingresá tu teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              required
            />

            <label htmlFor="register-cuil">
              CUIL
            </label>

            <input
              id="register-cuil"
              type="text"
              placeholder="Ingresá tu CUIL"
              value={cuil}
              onChange={(e) => setCuil(e.target.value)}
              inputMode="numeric"
              required
            />

            <label htmlFor="register-email">
              Correo electrónico
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="Ingresá tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="register-password">
              Contraseña
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="Creá una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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
                py: 1.5,
                borderRadius: "9px",
                backgroundColor: "#1456b8",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "#104594",
                },
              }}
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </Button>
          </form>

          <div className="login-register">
            ¿Ya tenés cuenta?

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>
          </div>

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

export default Register;
