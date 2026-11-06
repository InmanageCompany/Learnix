import ReportCardItem from './ReportCardItem';
import './ReportCardList.css';

function ReportCardList({ reportCards }) {
  if (reportCards.length === 0)
    return (
      <div className="student-report-empty">
        <h3>Todavía no hay boletines</h3>
        <p>Cuando haya calificaciones disponibles, vas a poder consultarlas desde acá.</p>
      </div>
    );

  return (
    <ul className="reportCard-list student-report-list">
      {reportCards.map((reportCard) => (
        <ReportCardItem
          key={reportCard.id}
          reportCard={reportCard}
        />
      ))}
    </ul>
  );
}

export default ReportCardList;