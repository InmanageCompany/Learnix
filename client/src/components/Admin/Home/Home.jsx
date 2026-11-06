import NavBarAdmin from '../NavBar/NavBar'
import { useState, useEffect } from 'react';
import axios from "axios";

function HomeAdmin() {
  const [activos, setActivos] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/getUsers",
        { headers: { Authorization: token } }
      );
      setActivos(response.data.cantidadActivos);
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
      <NavBarAdmin />
      <div className="admin-page">
        <h1>Panel del Administrador</h1>
        <p>Usuarios activos: {activos}</p>
      </div>
    </>
  );
}

export default HomeAdmin;