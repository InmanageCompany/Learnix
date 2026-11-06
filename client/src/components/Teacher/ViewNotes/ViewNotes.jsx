import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import NavBarTeacher from "../NavBar/NavBar";

function ViewNotes() {
  const location = useLocation();
  const state = location.state || {};
  const students = state.alumnos;
  const subjectId = state.subject_id;
  const periodId = state.period_id;
  const periodName = state.period_name;
  const token = localStorage.getItem("token");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasContext = Array.isArray(students) && subjectId != null && periodId != null;

  useEffect(() => {
    if (!hasContext) {
      setLoading(false);
      return;
    }

    const fetchGrades = async () => {
      try {
        const responses = await Promise.all(
          students.map((student) =>
            axios.get(
              `http://localhost:3000/api/teacher/seeGrade/${student.id}/${subjectId}/${periodId}`,
              { headers: { Authorization: token } }
            )
          )
        );

        setGrades(responses.flatMap((response) => response.data));
      } catch (error) {
        if (error.response)
          alert(error.response.data.message);
        else if (error.request)
          alert("No hay respuesta del servidor.");
        else
          alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [hasContext, students, subjectId, periodId, token]);

  return (
    <>
      <NavBarTeacher />
      <section className="teacher-page teacher-grades-page">
        <div className="teacher-grades-heading">
          <div>
            <h1>Notas de los alumnos</h1>
            <p>{periodName ? `Período: ${periodName}` : "Consulta de calificaciones"}</p>
          </div>
          <Button component={Link} to="/teacher/home" variant="outlined">
            Volver al inicio
          </Button>
        </div>

        {!hasContext ? (
          <p>Para consultar las notas, ingresá desde una materia en el panel del profesor.</p>
        ) : loading ? (
          <p role="status">Cargando calificaciones...</p>
        ) : grades.length === 0 ? (
          <p>No hay notas cargadas para este período.</p>
        ) : (
          <div className="teacher-grades-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre del alumno</th>
                  <th>Nota</th>
                  <th>Comentario</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade.id}>
                    <td>{grade.report_card.student.name}</td>
                    <td>
                      <span className="teacher-grade-value">{grade.grade_value}</span>
                    </td>
                    <td>{grade.comment || "Sin comentarios"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default ViewNotes;
