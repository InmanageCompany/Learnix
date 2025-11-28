import CourseItem from './CourseItem';
import './CoursesList.css';

function CoursesList({ courses, subjects }) {
  if (courses.length === 0)
    return <p>No hay cursos asignados.</p>;

  return (
    <ul className="courses-list">
      {courses.map((course) => (
        <CourseItem
          key={course.id}
          course={course}
          subjects={subjects}
        />
      ))}
    </ul>
  );
}

export default CoursesList;