import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginIcon from "@mui/icons-material/Login";
import NavBar from '../../General/NavBar/NavBar'

function LoginStudent() {
  const [cuil, setCuil] = useState("");
  const [tuition, setTuition] = useState("");
  const navigate = useNavigate();

  const fetchLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/user/login", {
        cuil: Number(cuil),
        tuition: Number(tuition),
      });

      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      navigate("/student/home");      
    } catch (error) {
      if (error.response) alert(error.response.data.message);
      else if (error.request) alert("No hay respuesta del servidor.");
      else alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <NavBar />
      <div className="login-container">
        <h1>Acceso Estudiantes</h1>
        <input type="text" placeholder="CUIL" onChange={(e) => setCuil(e.target.value)} />
        <input type="text" placeholder="Matrícula" onChange={(e) => setTuition(e.target.value)} />
        <Button variant="contained" onClick={fetchLogin} sx={{ mt: 2, backgroundColor: "#2196F3" }}>
          Ingresar <LoginIcon sx={{ ml: 1 }} />
        </Button>
      </div>
    </>
  );
}

export default LoginStudent;