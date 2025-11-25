import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Button } from '@mui/material';
import axios from "axios";
import NavBarTeacher from '../navBarPages/navBarTeacher';

function SeeAlumns() {
  const [alumns, setAlumns] = useState([]);

  const token = localStorage.getItem("token")
  const {ClassSection_id} = useParams()

  const location = useLocation();
  const state = location.state || {};
  const Sid = state.subject_id;

  const Alumns = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/teacher/students/${ClassSection_id}`,
        {
          headers: { Authorization: token }
        }
      );

      setAlumns(response.data.map(r => r.student));
      
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
    Alumns();
  }, []);

  return (
    <>
      <NavBarTeacher />
      <div className="teacher-page">
        <h1>Panel del Profesor</h1>
        <p>Visualize los alumnos de esta seccion</p>

        {alumns.length === 0 ? (
          <p>No hay alumnos asignados.</p>
        ) : (
          <ul>
            {alumns.map((item) => (
              <li key={item.id}>
                {item.name} - {item.email}
              </li>
            ))}
          </ul>
        )}

        <Button component={Link} to={`/ModNotes`} variant="contained"> Modificar notas </Button>
        <Button component={Link} to={`/AddNotes`} variant="contained" state={{ alumnos: alumns, subject_id: Sid}}> Agregar notas </Button>
      </div>
    </>
  );
}

export default SeeAlumns;