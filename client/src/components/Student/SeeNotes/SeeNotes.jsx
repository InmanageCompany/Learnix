import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import axios from "axios";
import NavBarStudent from '../NavBar/NavBar';
import "../Home/StudentPanel.css";

function SeeNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const { Report_Card_id } = useParams();

  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/student/notes/${Report_Card_id}`,
        {
          headers: { Authorization: token }
        }
      );

      setNotes(response.data);
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
  }, [Report_Card_id, token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <>
      <NavBarStudent />
      <main className="student-dashboard student-notes-page">
        <header className="student-notes-hero">
          <div>
            <span className="student-dashboard-eyebrow">TU HISTORIAL ACADÉMICO</span>
            <h1>Mis notas</h1>
            <p>Consultá tus calificaciones y observaciones por materia.</p>
          </div>
          <Button
            component={Link}
            to="/student/reportCards"
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
          >
            Volver a boletines
          </Button>
        </header>

        {loading ? (
          <p className="student-dashboard-status" role="status">Cargando tus notas...</p>
        ) : notes.length === 0 ? (
          <div className="student-report-empty">
            <h2>No hay notas registradas</h2>
            <p>Cuando se carguen calificaciones para este boletín, aparecerán acá.</p>
          </div>
        ) : (
          <section className="student-grade-grid" aria-label="Calificaciones por materia">
            {notes.map((item) => (
              <article className="student-grade-card" key={item.id}>
                <div className="student-grade-card-top">
                  <span className="student-grade-label">Calificación</span>
                  <span className="student-grade-value-row">
                    <strong>{item.grade_value}</strong>
                  </span>
                </div>
                <h2>{item.subject?.name || "Materia"}</h2>
                <p className="student-grade-comment">
                  {item.comment || "Sin observaciones para esta nota."}
                </p>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default SeeNotes;