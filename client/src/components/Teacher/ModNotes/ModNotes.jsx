import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Select, MenuItem } from '@mui/material';
import axios from "axios";
import NavBarTeacher from '../NavBar/NavBar';


function ModNotes() {

    const [seeNotes, setSeeNotes] = useState([]);
    const [updateMessage, setUpdateMessage] = useState("");

    const [notes, setNotes] = useState({});
    const [comment, SetComentario] = useState({});
    const [conceptual] = useState(["En proceso", "Suficiente", "Avanzado"]);
    const numericGrades = Array.from({ length: 10 }, (_, index) => index + 1);

    const token = localStorage.getItem("token")

    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state || {};
    const students = state.alumnos;
    const subject_id = state.subject_id;
    const period_id = state.period_id;

    const List = useCallback(async () => {
        try {
        let ar = [] 
        for (const s of students) {
            const response = await axios.get(
                `http://localhost:3000/api/teacher/seeGrade/${s.id}/${subject_id}/${period_id}`,
                { headers: { Authorization: token } }
            );
            ar.push(response.data);
            
        }
        setSeeNotes(ar);

        } catch (error) {
            if (error.response)
                alert(error.response.data.message);

            else if (error.request)
                alert("No hay respuesta del servidor.");

            else
                alert(`Error: ${error.message}`);
        }
    }, [students, subject_id, period_id, token]);

    const UpdateGrades = async (grade_id) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/teacher/updateGrade`, {
                idU: grade_id,
                grade_value: notes[grade_id],
                period_id: period_id,
                comment: comment[grade_id]
            },
                {
                    headers: { Authorization: token }
                }
            );

            setUpdateMessage(response.data.message || "La nota se modificó correctamente.");
            setNotes((current) => ({ ...current, [grade_id]: "" }));
            SetComentario((current) => ({ ...current, [grade_id]: "" }));
            await List();
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
    }, [List]);
    
    return (
        <>
            <NavBarTeacher />
            <div className="teacher-page">
                <h1>Modficar notas de los alumnos</h1>

                {updateMessage && (
                    <Alert
                        severity="success"
                        sx={{
                            mb: 2,
                            alignItems: "center",
                            textAlign: "left",
                            "& .MuiAlert-message": { flex: 1 }
                        }}
                        action={
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={() => setUpdateMessage("")}
                                >
                                    Seguir editando
                                </Button>
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={() => navigate(-1)}
                                >
                                    Volver a alumnos
                                </Button>
                            </div>
                        }
                    >
                        {updateMessage}
                    </Alert>
                )}

                {seeNotes.length === 0 ? (
                    <h2> No hay notas cargadas para modficar </h2>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre del alumno</th>
                                <th>Nota actual</th>
                                <th>Nota modificada</th>
                                <th>Comentario actual</th>
                                <th>Comentario modificada</th>
                            </tr>
                        </thead>

                        <tbody>
                            {seeNotes.map(item => item.map((n) => (
                                <tr>
                                <th key={n.id}>
                                    {n.report_card.student.name}
                                </th>
                                <th key={n.id}>
                                    {n.grade_value}
                                </th>
                                <th>
                                    {period_id == 1 || period_id == 3 ? (
                                        <Select
                                            value={notes[n.id] || ""}
                                            label="Notas"
                                            onChange={(e) =>
                                                setNotes({
                                                    ...notes,
                                                    [n.id]: e.target.value
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
                                        <Select
                                            value={notes[n.id] ?? ""}
                                            displayEmpty
                                            inputProps={{ "aria-label": `Nueva nota de ${n.report_card.student.name}` }}
                                            onChange={(e) =>
                                                setNotes({
                                                    ...notes,
                                                    [n.id]: e.target.value
                                                })
                                            }
                                        >
                                            <MenuItem value="" disabled>Elegir nota</MenuItem>
                                            {numericGrades.map((grade) => (
                                                <MenuItem key={grade} value={String(grade)}>
                                                    {grade}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                </th>
                                <th key={n.id}>
                                    {n.comment || "Ningun comentario"}
                                </th>
                                <th>
                                    <input type="text" placeholder="Comentario" onChange={(e) => SetComentario({
                                        ...comment,
                                        [n.id]: e.target.value
                                    })} />
                                </th>
                                <th>
                                    <Button onClick={() => UpdateGrades(n.id)} variant="contained"> Modificar nota</Button>
                                </th>
                            </tr>
                            )))}
                        </tbody>
                    </table>
                )}

            </div>
        </>
    );
}

export default ModNotes;