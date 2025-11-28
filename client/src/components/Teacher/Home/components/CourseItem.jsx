import SubjectItem from './SubjectItem';
import './CourseItem.css';

function CourseItem({ course, subjects }) {
  const subjectsInCourse = subjects.filter(
    (s) => s.class_section_id === course.id
  );

  return (
    <li className="course-item">
      <h3>{course.name}</h3>

      {subjectsInCourse.length === 0 ? (
        <p>No hay ninguna materia registrada en este curso.</p>
      ) : (
        <ul className="subject-list">
          {subjectsInCourse.map((subject) => (
            <SubjectItem key={subject.id} subject={subject} course={course} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default CourseItem;