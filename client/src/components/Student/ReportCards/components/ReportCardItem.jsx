import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './ReportCardItem.css';

function ReportCardItem({ reportCard }) {
  return (
    <li className="subject-item">
      {reportCard.period.name}

      <Button
        component={Link}
        to={`/student/notes/${reportCard.id}`}
        state={{ Report_Card_id: reportCard.id }}
        variant="contained"
        sx={{
          padding: "4px 10px",
          fontSize: "0.75rem",
          marginLeft: "20px",
          backgroundColor: "#2196F3"
        }}
      >
        Ver notas
      </Button>
    </li>
  );
}

export default ReportCardItem;