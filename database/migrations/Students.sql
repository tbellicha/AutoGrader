CREATE TABLE Students(
    Student_ID INT AUTO_INCREMENT, -- ID number for student
    First_Name VARCHAR(50), -- First Name
    Last_Name VARCHAR(50), -- Last Name
    Email VARCHAR(50), -- Student's Email Address
    CONSTRAINT StudentsPK PRIMARY KEY (Student_ID), -- Primary Key Constraint
    CONSTRAINT ST_FN_NN CHECK(First_Name IS NOT NULL), -- First Name Not Null Constraint
    CONSTRAINT ST_LN_NN CHECK(Last_Name IS NOT NULL), -- Last Name Not Null Constraint
    CONSTRAINT ST_EMAIL_UNIQUE UNIQUE(Email), -- Email Unique Constraint
);