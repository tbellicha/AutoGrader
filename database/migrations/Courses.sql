CREATE TABLE Courses(
    Course_ID INT AUTO_INCREMENT, -- ID number for courses
    Course_Code VARCHAR(50), -- Course Code
    Course_Name VARCHAR(50), -- Course Name
    Teacher_ID INT, -- Foreign Key to Teachers Table
    CONSTRAINT CoursesPK PRIMARY KEY (Course_ID), -- Primary Key Constraint
    CONSTRAINT CO_CODE_NN CHECK(Course_Code IS NOT NULL), -- Course Code Not Null Constraint
    CONSTRAINT CO_NAME_NN CHECK(Course_Name IS NOT NULL), -- Course Name Not Null Constraint
    CONSTRAINT CO_TEACHER_FK FOREIGN KEY (Teacher_ID) REFERENCES Teachers(Teacher_ID) -- Foreign Key Constraint
);