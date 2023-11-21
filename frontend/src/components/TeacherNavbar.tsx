import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const location = useLocation();

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/TeacherDashboard" className={`nav-link ${isLinkActive('/TeacherDashboard') ? 'active' : ''}`}>
              Teacher Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/CourseCreation" className={`nav-link ${isLinkActive('/CourseCreation') ? 'active' : ''}`}>
              Create Course
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/AssignmentCreation" className={`nav-link ${isLinkActive('/AssignmentCreation') ? 'active' : ''}`}>
              Create Assignment
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/StudentEnrollment" className={`nav-link ${isLinkActive('/StudentEnrollment') ? 'active' : ''}`}>
              Enroll Students
            </NavLink>
          </li>
        </ul>
      </div>
      <span className="navbar-text" style={{ marginLeft: '20px', marginRight: '20px', fontSize: '20px' }}>
        <strong>AutoGrader</strong>
      </span>
    </nav>
  );
};

export default NavBar;