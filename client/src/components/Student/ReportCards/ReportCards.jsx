import NavBarStudent from '../NavBar/NavBar';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReportCardList from './components/ReportCardList';

function HomeTeacher() {
  const [reportCards, setReportCards] = useState([]);

  const token = localStorage.getItem("token");

  // === Fetch boletines ===
  const fetchReportCards = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/student/reportCards",
        { headers: { Authorization: token } }
      );
      setReportCards(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error al cargar boletines.");
    }
  };

  useEffect(() => {
    fetchReportCards();
  }, []);

  return (
    <>
      <NavBarStudent />
      <div className="teacher-page">
        <ReportCardList reportCards={reportCards} />
      </div>
    </>
  );
}

export default HomeTeacher;