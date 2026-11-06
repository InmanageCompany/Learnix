import CourseItem from './CourseItem';
import './CoursesList.css';

function CoursesList({ courses }) {
  if (courses.length === 0)
    return <p>No hay cursos activos.</p>;

  return (
    <ul className="courses-list">
      {courses.map((course) => (
        <CourseItem key={course.id} course={course} />
      ))}
    </ul>
  );
}

export default CoursesList;
