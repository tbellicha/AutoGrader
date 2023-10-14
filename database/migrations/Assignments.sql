CREATE TABLE Assignments(
    Assignment_ID INT AUTO_INCREMENT, -- ID number for assignment
    Course_ID INT, -- Foreign Key to Courses Table
    Title VARCHAR(100), -- Assignment Title
    `Description` VARCHAR(250), -- Assignment Description
    Due_Date DATETIME, -- Assignment Due Date
    CONSTRAINT AssignmentsPK PRIMARY KEY (Assignment_ID), -- Primary Key Constraint
    CONSTRAINT AS_TITLE_NN CHECK(Title IS NOT NULL), -- Assignment Title Not Null Constraint
    CONSTRAINT AS_DESC_NN CHECK(`Description` IS NOT NULL), -- Assignment Description Not Null Constraint
    CONSTRAINT AS_DUE_DATE_NN CHECK(Due_Date IS NOT NULL), -- Assignment Due Date Not Null Constraint
    CONSTRAINT AS_COURSE_FK FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID) -- Foreign Key Constraint
);