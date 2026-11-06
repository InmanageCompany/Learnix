import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import './ReportCardItem.css';

function ReportCardItem({ reportCard }) {
  return (
    <li className="student-report-card">
      <div className="student-report-card-content">
        <span>Boletín académico</span>
        <h3>{reportCard.period.name}</h3>
      </div>
      <Button
        component={Link}
        to={`/student/notes/${reportCard.id}`}
        state={{ Report_Card_id: reportCard.id }}
        variant="outlined"
        endIcon={<ArrowForwardRoundedIcon />}
        aria-label={`Ver notas de ${reportCard.period.name}`}
      >
        Ver notas
      </Button>
    </li>
  );
}

export default ReportCardItem;