CREATE TABLE Users(
    User_ID INT AUTO_INCREMENT, -- ID number for user
    Student_ID INT, -- Foreign Key to Students Table (can be null)
    Teacher_ID INT, -- Foreign Key to Teachers Table (can be null)
    `Role` VARCHAR(50), -- User Role
    Username VARCHAR(50), -- Username
    Password VARCHAR(50), -- Password
    CONSTRAINT UsersPK PRIMARY KEY (User_ID), -- Primary Key Constraint
    CONSTRAINT US_ROLE_NN CHECK(`Role` IS NOT NULL), -- Role Not Null Constraint
    CONSTRAINT US_USERNAME_NN CHECK(Username IS NOT NULL), -- Username Not Null Constraint
    CONSTRAINT US_PASSWORD_NN CHECK(Password IS NOT NULL), -- Password Not Null Constraint
    CONSTRAINT US_STUDENT_FK FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID), -- Foreign Key Constraint
    CONSTRAINT US_TEACHER_FK FOREIGN KEY (Teacher_ID) REFERENCES Teachers(Teacher_ID) -- Foreign Key Constraint
);