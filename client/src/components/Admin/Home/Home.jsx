import NavBarAdmin from '../NavBar/NavBar'
import { useState, useEffect } from 'react';
import axios from "axios";

function HomeAdmin() {
  const [activos, setActivos] = useState(0);
  const [clases, setClases] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    fetchCourse();
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
    const fetchCourse = async () => {
    const response = await axios.get("http://localhost:3000/api/admin/course",
      {
        headers: {
          Authorization: token
        }
      }
    );
    console.log(response.data);
    setClases(response.data.cursos);
  };

  return (
    <>
      <NavBarAdmin />
      <div>
        <tr>
          <td className="admin-rectangle">
            <h1>Usuarios activos: {activos}</h1>
          </td>
          <td className="admin-rectangle">
            <h1>Cursos: {clases}</h1>
          </td>
        </tr>
      </div>
    </>
  );
}

export default HomeAdmin;