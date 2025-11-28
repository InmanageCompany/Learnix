import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginIcon from "@mui/icons-material/Login";

import NavBar from "../NavBar/NavBar";

function Register() {
   const [name, setName] = useState("");
   const [date_of_birth, setDate_of_birth] = useState("");
   const [phone, setPhone] = useState("");
   const [cuil, setCuil] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const fetchRegister = async () => {
      if (!name || !date_of_birth || !phone || !cuil || !email || !password) {
         alert("Por favor, complete todos los campos obligatorios.");
         return;
      }

      const cleanCuil = cuil.replace(/\D/g, '');
      const cleanPhone = phone.replace(/\D/g, '');

      try {
         const response = await axios.post("http://localhost:3000/api/teacher/register", {
            name,
            date_of_birth,
            phone: cleanPhone,
            cuil: cleanCuil,
            email,
            password,
         });

         navigate("/login");
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
            <h1>Registro</h1>
            <input type="text" placeholder="Nombre completo" onChange={(e) => setName(e.target.value)} />
            <input type="date" onChange={(e) => setDate_of_birth(e.target.value)} />
            <input type="text" placeholder="Teléfono" onChange={(e) => setPhone(e.target.value)} />
            <input type="text" placeholder="Cuil" onChange={(e) => setCuil(e.target.value)} />
            <input type="email" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" onClick={fetchRegister} sx={{ mt: 2, backgroundColor: "#2196F3" }} > Registrarse <LoginIcon sx={{ ml: 1 }} /> </Button>
         </div>
      </>
   );
}

export default Register;

// { name, date_of_birth, phone, cuil, tuition, email, password } 