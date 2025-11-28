import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginIcon from "@mui/icons-material/Login";

import NavBar from '../NavBar/NavBar'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const fetchLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/user/login", {
        email,
        password
      });

      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") navigate("/admin/home");
      else if (role === "teacher") navigate("/teacher/home");
      else if (role === "rector") navigate("/rector/home");
      else alert("Rol no reconocido");
    } catch (error) {
      if (error.response)
        alert(error.response.data.message);

      else if (error.request)
        alert("No hay respuesta del servidor.");

      else
        alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <NavBar />
      <div className="login-container">
        <h1>Inicio de Sesión</h1>
        <input type="text" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" onClick={fetchLogin} sx={{ mt: 2, backgroundColor: "#2196F3" }}>
          Login <LoginIcon sx={{ ml: 1 }} />
        </Button>
      </div>
    </>
  );
}

export default Login;