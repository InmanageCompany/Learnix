import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Button, Select, MenuItem } from '@mui/material';
import axios from "axios";
import NavBarTeacher from '../navBarPages/navBarTeacher';


function ModNotes() {

    const [seeNotes, setSeeNotes] = useState([]);

    const [notes, setNotes] = useState({});
    const [comment, SetComentario] = useState({});
    const [conceptual, SetConceptual] = useState(["En proceso", "Suficiente", "Avanzado"]);

    const token = localStorage.getItem("token")

    const location = useLocation();
    const state = location.state || {};
    const students = state.alumnos;
    const subject_id = state.subject_id;
    const period_id = state.period_id;

    console.log(period_id);
    console.log(subject_id);

    const List = async () => {
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
    };

    const UpdateGrades = async (grade_id) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/teacher/updateGrade`, {
                grade_id,
                grade_value: notes[grade_id],
                period_id: period_id,
                comment: comment[grade_id]
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

    useEffect(() => {
        //practica
        console.log(seeNotes);
        console.log(seeNotes.map(item => item.map((a) => a.report_card.student.name)));
    }, [seeNotes]);
    

    return (
        <>
            <NavBarTeacher />
            <div className="teacher-page">
                <h1>Modficar notas de los alumnos</h1>

                {seeNotes.length === 0 ? (
                    <h1> No hay notas cargadas para modficar </h1>
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
                                        <input type="text" placeholder="Numero" onChange={(e) =>
                                            setNotes({
                                                ...notes,
                                                [n.id]: e.target.value
                                            })
                                        } />
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