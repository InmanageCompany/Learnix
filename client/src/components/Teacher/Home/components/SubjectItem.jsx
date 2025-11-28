import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './SubjectItem.css';

function SubjectItem({ subject, course }) {
  return (
    <li className="subject-item">
      {subject.subject.name}

      <Button
        component={Link}
        to={`/teacher/students/${course.id}`}
        state={{ subject_id: subject.subject.id }}
        variant="contained"
        sx={{
          padding: "4px 10px",
          fontSize: "0.75rem",
          marginLeft: "20px",
          backgroundColor: "#2196F3"
        }}
      >
        Ver alumnos
      </Button>
    </li>
  );
}

export default SubjectItem;