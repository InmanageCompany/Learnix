import NavBarStudent from '../NavBar/NavBar'

function HomeStudent() {
  return (
    <>
      <NavBarStudent />
      <div className="student-page">
        <h1>Panel del Estudiante</h1>
        <p>Supervisa tus notas.</p>
      </div>
    </>
  );
}

export default HomeStudent;