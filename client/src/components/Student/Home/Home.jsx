import { useCallback, useEffect, useState } from "react";
import NavBarStudent from '../NavBar/NavBar'
import { Button } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link } from "react-router-dom";
import axios from "axios";
import ReportCardList from "../ReportCards/components/ReportCardList";
import "./StudentPanel.css";

function HomeStudent() {
  const [reportCards, setReportCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchReportCards = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/student/reportCards",
        { headers: { Authorization: token } }
      );
      setReportCards(response.data);
    } catch (error) {
      if (error.response)
        alert(error.response.data.message || "Error al cargar boletines.");
      else if (error.request)
        alert("No hay respuesta del servidor.");
      else
        alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReportCards();
  }, [fetchReportCards]);

  return (
    <>
      <NavBarStudent />
      <main className="student-home-dashboard">
        <section className="student-page student-home-image">
          <div className="student-home-content">
            <span className="student-home-eyebrow">TU ESPACIO LEARNIX</span>
            <h1>Panel del estudiante</h1>
            <p>Consultá tus notas y seguí tu recorrido académico desde un solo lugar.</p>
            <Button
              component={Link}
              to="/student/reportCards"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              className="student-home-button"
            >
              Ver mis boletines
            </Button>
          </div>
        </section>

        <section className="student-home-reports" aria-labelledby="student-home-reports-title">
          <header className="student-home-reports-heading">
            <div>
              <span className="student-home-reports-eyebrow">SEGUIMIENTO ACADÉMICO</span>
              <h2 id="student-home-reports-title">Mis boletines</h2>
              <p>Elegí un período para consultar las notas de tus materias.</p>
            </div>
            {!loading && reportCards.length > 0 && (
              <span className="student-home-report-count">
                {reportCards.length} {reportCards.length === 1 ? "período" : "períodos"}
              </span>
            )}
          </header>

          {loading ? (
            <p className="student-home-reports-status" role="status">
              Cargando tus boletines...
            </p>
          ) : (
            <ReportCardList reportCards={reportCards} />
          )}
        </section>
      </main>
    </>
  );
}

export default HomeStudent;