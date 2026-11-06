import { useCallback, useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import axios from "axios";
import NavBarTeacher from '../NavBar/NavBar';

function SeeStudents() {
  const [alumns, setAlumns] = useState([]);
  const [periods, SetPeriods] = useState([]);
  const [sel_periods, SetSel_periods] = useState("");

  const token = localStorage.getItem("token")
  const { ClassSection_id } = useParams()
  const modalRef = useRef(null);
  const gradePeriodsRef = useRef(null);

  const location = useLocation();
  const state = location.state || {};
  const Sid = state.subject_id;
  const shouldOpenGradePeriods = state.openGradePeriods;

  const Alumns = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/teacher/students/${ClassSection_id}/${Sid}/${sel_periods}`,
        {
          headers: { Authorization: token }
        }
      );
      console.log(response.data);

      setAlumns(response.data);
    } catch (error) {
      if (error.response)
        alert(error.response.data.message);

      else if (error.request)
        alert("No hay respuesta del servidor.");

      else
        alert(`Error: ${error.message}`);
    } 
  }, [ClassSection_id, token, sel_periods, Sid]);

  const Periods = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/teacher/periods`,
        {
          headers: { Authorization: token }
        }
      );

      SetPeriods(response.data);
      if (response.data.length > 0) SetSel_periods(response.data[0].id);
    } catch (error) {
      if (error.response)
        alert(error.response.data.message);

      else if (error.request)
        alert("No hay respuesta del servidor.");

      else
        alert(`Error: ${error.message}`);
    }
  }, [token]);

  useEffect(() => {
    Periods();
  }, []);

  useEffect(() => {
    if (!sel_periods) return;   // ← no consulta hasta que haya período
    Alumns();
  }, [sel_periods, ClassSection_id, Sid]);

  return (
    <>
      <NavBarTeacher />
      <div className="teacher-page">
        <h1>Panel del Profesor</h1>
        <p>Visualize los alumnos de esta seccion</p>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="period-label">Periodos</InputLabel>
          <Select
            labelId="period-label"
            value={sel_periods}
            label="Periodos"
            onChange={(e) => SetSel_periods(e.target.value)}
          >
            {periods.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {alumns.length === 0 ? (
          <p>No hay alumnos asignados.</p>
        ) : (
          <ul>
            {alumns.map((a) => (
              <li key={a.id}>
                {a.name} -{" "}
                {a.filtered ? (
                  <>
                    {a.filtered.grade_value} - {a.filtered.comment}
                  </>
                ) : (
                  "No hay nota registrada"
                )}
              </li>
            ))}
          </ul>
        )}

        <Button variant="contained" onClick={() => modalRef.current.showModal()}>
          Modificar Notas
        </Button>
        <Button component={Link} to={`/teacher/notes/add`} variant="contained" state={{ alumnos: alumns, subject_id: Sid }}> Agregar notas </Button>
        <Button variant="outlined" onClick={() => gradePeriodsRef.current.showModal()}>
          Ver notas
        </Button>
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
        <dialog ref={gradePeriodsRef}>
          <h3>Elegí un período para consultar</h3>
          {periods.map((p) => (
            <Button
              key={p.id}
              component={Link}
              to="/teacher/notes/view"
              variant="contained"
              state={{ alumnos: alumns, subject_id: Sid, period_id: p.id, period_name: p.name }}
              sx={{ mt: 2, display: "block", width: "100%" }}
            >
              {p.name}
            </Button>
          ))}
          <Button
            variant="text"
            onClick={() => gradePeriodsRef.current.close()}
            sx={{ mt: 1, display: "block", width: "100%" }}
          >
            Cerrar
          </Button>
        </dialog>
      </div>
    </>
  );
}

export default SeeStudents;