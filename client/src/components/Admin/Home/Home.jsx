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
    const response = await axios.get("http://localhost:3000/api/admin/users",
      {
        headers: {
          Authorization: token
        }
      }
    );

    console.log(response.data);
    setActivos(response.data.cantidadActivos);
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