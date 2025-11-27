import { useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Button } from '@mui/material';
import axios from "axios";
import NavBarTeacher from '../NavBar/NavBar';

function SeeStudents() {
  const [alumns, setAlumns] = useState([]);
  const [periods, SetPeriods] = useState([]);

  const token = localStorage.getItem("token")
  const { ClassSection_id } = useParams()
  const modalRef = useRef(null);

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

  const Periods = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/teacher/periods`,
        {
          headers: { Authorization: token }
        }
      );

      SetPeriods(response.data);
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
    Periods();
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

        <Button variant="contained" onClick={() => modalRef.current.showModal()}>
          Modificar Notas
        </Button>
        <Button component={Link} to={`/teacher/notes/add`} variant="contained" state={{ alumnos: alumns, subject_id: Sid }}> Agregar notas </Button>
        <dialog ref={modalRef}>
          <h3>Elija un bimestre</h3>

          {periods.map((p) => (
            <Button
            component={Link}
            to={`/teacher/notes/mod`}
            variant="contained"
            state={{ alumnos: alumns, subject_id: Sid, period_id: p.id }}
            sx={{ 
              mt: 2, 
              backgroundColor: "#2196F3",
              display: "block", 
              width: "100%"     
            }}
          >
            {p.name}
          </Button>
          ))}
        </dialog>
      </div>
    </>
  );
}

export default SeeStudents;