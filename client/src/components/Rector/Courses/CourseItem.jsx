import './CourseItem.css';

function CourseItem({ course }) {
  return (
    <li className="course-item">
      {course.name}
    </li>
  );
}

export default CourseItem;
