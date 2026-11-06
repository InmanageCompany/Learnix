import { Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import './SubjectItem.css';

function SubjectItem({ subject, course }) {
  return (
    <li className="subject-item">
      {subject.subject.name}

      <Stack direction="row" spacing={1} className="subject-actions">
        <Button
          component={Link}
          to={`/teacher/students/${course.id}`}
          state={{ subject_id: subject.subject.id }}
          variant="outlined"
          size="small"
        >
          Ver alumnos
        </Button>
        <Button
          component={Link}
          to={`/teacher/students/${course.id}`}
          state={{ subject_id: subject.subject.id, openGradePeriods: true }}
          variant="contained"
          size="small"
        >
          Ver notas
        </Button>
      </Stack>
    </li>
  );
}

export default SubjectItem;