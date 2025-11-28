import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginIcon from "@mui/icons-material/Login";

import NavBarAdmin from "../../Admin/NavBar/NavBar";
import NavBarRector from "../../Rector/NavBar/NavBar";
import NavBarStudent from "../../Student/NavBar/NavBar";
import NavBarTeacher from "../../Teacher/NavBar/NavBar";

import LogoutButton from "../LogOut/LogOut";

function Profile() {
   const [name, setName] = useState("");
   const [date_of_birth, setDate_of_birth] = useState("");
   const [phone, setPhone] = useState("");
   const [cuil, setCuil] = useState("");
   const [tuition, setTuition] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const token = localStorage.getItem("token");
   const role = localStorage.getItem("role");

   const fetchUpdate = async () => {
      const cleanCuil = cuil.replace(/\D/g, '');
      const cleanPhone = phone.replace(/\D/g, '');

      try {
         const response = await axios.put("http://localhost:3000/api/user/update",
            {
               name,
               date_of_birth,
               phone: cleanPhone,
               cuil: cleanCuil,
               tuition,
               email,
               password,
            },
            {
               headers: {
                  Authorization: token
               }
            }
         );

         if (role === "admin") navigate("/admin/home");
         else if (role === "teacher") navigate("/teacher/home");
         else if (role === "rector") navigate("/rector/home");
         else if (role === "student") navigate("/student/home");
      } catch (error) {
         if (error.response)
            alert(error.response.data.message);
         else if (error.request)
            alert("No hay respuesta del servidor.");
         else
            alert(`Error: ${error.message}`);
      }
   };

   let navBarComponent;

   switch (role) {
      case "admin":
         navBarComponent = <NavBarAdmin />;
         break;
      case "teacher":
         navBarComponent = <NavBarTeacher />;
         break;
      case "student":
         navBarComponent = <NavBarStudent />;
         break;
      case "rector":
         navBarComponent = <NavBarRector />;
         break;
      default:
         navBarComponent = null;
   }


   return (
      <>
         {navBarComponent}
         <div className="login-container">
            <h1>Perfil</h1>
            <input type="text" placeholder="Nombre completo" onChange={(e) => setName(e.target.value)} />
            <input type="date" onChange={(e) => setDate_of_birth(e.target.value)} />
            <input type="text" placeholder="Teléfono" onChange={(e) => setPhone(e.target.value)} />
            <input type="text" placeholder="Cuil" onChange={(e) => setCuil(e.target.value)} />
            {
               role === "student" ? <>
                  <input type="text" placeholder="Matricula" onChange={(e) => setTuition(e.target.value)} />
                  <input type="email" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} />
               </> : <>
                  <input type="email" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
               </>
            }
            <Button variant="contained" onClick={fetchUpdate} sx={{ mt: 2, backgroundColor: "#2196F3" }} > Actualizar <LoginIcon sx={{ ml: 1 }} /> </Button>
            <LogoutButton />
         </div>
      </>
   );
}

export default Profile;