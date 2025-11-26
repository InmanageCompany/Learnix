import NavBarTeacher from '../navBarPages/navBarTeacher';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function HomeTeacher() {
  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const modalRef = useRef(null);

  const token = localStorage.getItem("token")

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/teacher/courses",
        {
          headers: { Authorization: token }
        }
      );

      setCourses(response.data);
    } catch (error) {
      if (error.response)
        alert(error.response.data.message);
      else if (error.request)
        alert("No hay respuesta del servidor.");
      else
        alert(`Error: ${error.message}`);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/teacher/subjects`,
        {
          headers: { Authorization: token }
        }
      );

      setSubjects(response.data);
      console.log(subjects);
    } catch (error) {
      if (error.response)
        alert(error.response.data.message);
      else if (error.request)
        alert("No hay respuesta del servidor.");
      else
        alert(`Error: ${error.message}`);
    }
  };

  const fetchCourseCode = async () => {
    try {
      await axios.put("http://localhost:3000/api/teacher/codeCourse",
        {
          code: Number(courseCode)
        },
        {
          headers: { Authorization: token }
        }
      );

      modalRef.current.close();
      fetchCourses();
      alert("Código ingresado correctamente.");
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
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [courses]);
  return (
    <>
      <NavBarTeacher />
      <div className="teacher-page">
        <h1>Panel del Profesor</h1>
        <p>Gestione sus clases y calificaciones aquí.</p>

        {courses.length === 0 ? (
          <p>No hay cursos asignados.</p>
        ) : (
          <ul>
            {courses.map((item) => (
              <li key={item.id}>
                {item.name}
                {subjects.filter((s) => s.class_section_id === item.id).length > 0 ?
                  subjects.filter((s) => s.class_section_id === item.id).map(s => (
                    <ul>
                      <li key={s.id}>
                        {s.subject.name}
                        <Button
                          component={Link}
                          to={`/seeAlumns/${item.id}`}
                          state={{ subject_id: s.subject.id }}
                          variant="contained"
                          sx={{
                            padding: "4px 10px",
                            fontSize: "0.75rem",
                            marginLeft: "20px",
                            backgroundColor: "#2196F3"
                          }}
                        >
                          Ver alumnos
                        </Button>
                      </li>
                    </ul>
                  ))
                  : (
                    <ul>
                      <li>No hay ninguna materia registrada en este curso</li>
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        )}

        <Button variant="contained" onClick={() => modalRef.current.showModal()} sx={{ mt: 2, backgroundColor: "#2196F3" }}>
          Ingresar código
        </Button>

        <dialog ref={modalRef}>
          <h3>Código de clase</h3>

          <input type="text" placeholder="Código" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />

          <Button variant="contained" onClick={fetchCourseCode} sx={{ mt: 2, backgroundColor: "#2196F3" }} >
            Aceptar
          </Button>

          <Button variant="contained" onClick={() => modalRef.current.close()} sx={{ mt: 2, backgroundColor: "#2196F3" }}>
            Cerrar
          </Button>
        </dialog>
      </div>
    </>
  );
}

export default HomeTeacher;