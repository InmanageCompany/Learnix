import ReportCardItem from './ReportCardItem';
import './ReportCardList.css';

function ReportCardList({ reportCards }) {
  if (reportCards.length === 0)
    return <p>No hay boletines cargados.</p>;

  return (
    <ul className="reportCard-list">
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