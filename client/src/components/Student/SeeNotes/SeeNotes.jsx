import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBarStudent from '../NavBar/NavBar';

function SeeStudents() {
  const [notes, setNotes] = useState([]);

  const token = localStorage.getItem("token")
  const { Report_Card_id } = useParams()

  const fetchNotes = async () => {
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
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <NavBarStudent />
      <div className="teacher-page">
        {notes.length === 0 ? (
          <p>No hay notas registradas.</p>
        ) : (
          <ul>
            {notes.map((item) => (
              <li key={item.id}>
                {item.subject.name} - {item.comment} - {item.grade_value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default SeeStudents;