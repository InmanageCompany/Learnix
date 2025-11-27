import NavBarTeacher from '../NavBar/NavBar';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import CoursesList from './components/CoursesList';

function HomeTeacher() {
  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const modalRef = useRef(null);

  const token = localStorage.getItem("token");

  // === Fetch cursos ===
  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/teacher/courses",
        { headers: { Authorization: token } }
      );
      setCourses(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error al cargar cursos.");
    }
  };

  // === Fetch materias ===
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/teacher/subjects",
        { headers: { Authorization: token } }
      );
      setSubjects(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error al cargar materias.");
    }
  };

  // === Enviar código del curso ===
  const fetchCourseCode = async () => {
    try {
      await axios.put(
        "http://localhost:3000/api/teacher/codeCourse",
        { code: Number(courseCode) },
        { headers: { Authorization: token } }
      );

      modalRef.current.close();
      fetchCourses();
      alert("Código ingresado correctamente.");
    } catch (error) {
      alert(error.response?.data?.message || "Error al enviar código.");
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

        <CoursesList courses={courses} subjects={subjects} />

        <Button
          variant="contained"
          onClick={() => modalRef.current.showModal()}
          sx={{ mt: 2, backgroundColor: "#2196F3" }}
        >
          Ingresar código
        </Button>

        <dialog ref={modalRef}>
          <h3>Código de clase</h3>
          <input
            type="text"
            placeholder="Código"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />

          <Button variant="contained" onClick={fetchCourseCode} sx={{ mt: 2 }}>
            Aceptar
          </Button>

          <Button variant="contained" onClick={() => modalRef.current.close()} sx={{ mt: 2 }}>
            Cerrar
          </Button>
        </dialog>
      </div>
    </>
  );
}

export default HomeTeacher;