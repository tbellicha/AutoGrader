CREATE TABLE Enrollments(
    Enrollment_ID INT AUTO_INCREMENT, -- ID number for enrollment
    Student_ID INT, -- Foreign Key to Students Table
    Course_ID INT, -- Foreign Key to Courses Table
    CONSTRAINT EnrollmentsPK PRIMARY KEY (Enrollment_ID), -- Primary Key Constraint
    CONSTRAINT EN_STUDENT_NN CHECK(Student_ID IS NOT NULL), -- Student ID Not Null Constraint
    CONSTRAINT EN_COURSE_NN CHECK(Course_ID IS NOT NULL), -- Course ID Not Null Constraint
    CONSTRAINT EN_STUDENT_FK FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID), -- Foreign Key Constraint
    CONSTRAINT EN_COURSE_FK FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID) -- Foreign Key Constraint
);