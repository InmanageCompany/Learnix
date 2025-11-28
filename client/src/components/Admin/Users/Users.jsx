import NavBarAdmin from '../NavBar/NavBar'
import { useState, useEffect } from 'react';
import axios from "axios";

function UsersAdmin() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token")

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/getUsers",
        {
          headers: { Authorization: token }
        }
      );

      console.log(response.data);


      setUsers(response.data);
    } catch (error) {
      if (error.response)
        alert(error.response.data.message);
      else if (error.request)
        alert("No hay respuesta del servidor.");
      else
        alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <NavBarAdmin />
      <div className="teacher-page">
        <h1>Usuarios</h1>
        <p>vista de usuarios</p>

        {users.length === 0 ? (
          <p>No hay cursos asignados.</p>
        ) : (
          <>
            {
              users.map((item) => (
                <div className="feature-card" key={item.id}>
                  <ul>
                    <li>{item.name}</li>
                  </ul>
                </div>
              ))
            }
          </>
        )}
      </div>
    </>
  );
}

export default UsersAdmin;