import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Button, Select, MenuItem } from '@mui/material';
import axios from "axios";
import NavBarTeacher from '../navBarPages/navBarTeacher';


function AddNotes() {
  const [periods, SetPeriods] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState({});
  const [notes, setNotes] = useState({});
  
  const [comment, SetComentario] = useState({});
  const [conceptual, SetConceptual] = useState(["En proceso", "Suficiente", "Avanzado"]);
  const token = localStorage.getItem("token")

  const location = useLocation();
  const state = location.state || {};
  const students = state.alumnos;
  const subject_id = state.subject_id;

  const List = async () => {
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

  const Grades = async (user_id) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/teacher/addGrade`,{
        user_id,
        grade_value: notes[user_id],
        period: selectedPeriods[user_id],
        comment: comment[user_id],
        subject_id
      },
        {
          headers: { Authorization: token }
        }
      );

      alert(response.data.message);
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
    List();
  }, []);


  return (
    <>
      <NavBarTeacher />
      <div className="teacher-page">
        <h1>Añadir notas de los alumnos</h1>

        <table>
          <thead>
            <tr>
              <th>Nombre del alumno</th>
              <th>Periodo</th>
              <th>Nota</th>
              <th>Comentario</th>
            </tr>
          </thead>
          {students.length === 0 ? (
            <p>No hay alumnos asignados.</p>
          ) : (
            <tbody>
              {students.map((item) => (
                <tr>
                  <th key={item.id}>
                    {item.name}
                  </th>
                  <th>
                    <Select
                      value={selectedPeriods[item.id] || ""}
                      label="Periodo"
                      onChange={(e) =>
                        setSelectedPeriods({
                          ...selectedPeriods,
                          [item.id]: e.target.value
                        })
                      }
                    >
                      {periods.map((p) => (
                        <MenuItem key={p.id} value={p.name}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </th>
                  <th>
                    {selectedPeriods[item.id] == "Primer Trimestre" || selectedPeriods[item.id] == "Tercer Trimestre" ? (
                      <Select
                        value={notes[item.id] || ""}
                        label="Notas"
                        onChange={(e) =>
                          setNotes({
                            ...notes,
                            [item.id]: e.target.value
                          })
                        }
                      >
                        {conceptual.map((c, i) => (
                          <MenuItem key={i} value={c}>
                            {c}
                          </MenuItem>))
                        }
                      </Select>
                    ) : (
                      <input type="text" placeholder="Numero" onChange={(e) =>
                        setNotes({
                          ...notes,
                          [item.id]: e.target.value
                        })
                      } />
                    )}
                  </th>
                  <th>
                    <input type="text" placeholder="Comentario" onChange={(e) => SetComentario({
                      ...comment,
                      [item.id]: e.target.value
                    })} />
                  </th>
                  <th>
                  <Button onClick={() => Grades(item.id)} variant="contained"> Agregar </Button>
                  </th>
                </tr>
              ))}
            </tbody>
          )}

        </table>
      </div>
    </>
  );
}

export default AddNotes;