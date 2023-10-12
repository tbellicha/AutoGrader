CREATE TABLE Teachers(
  Teacher_ID INT AUTO_INCREMENT, -- ID number for teacher
  First_Name VARCHAR(50), -- First Name
  Last_Name VARCHAR(50), -- Last Name
  Email VARCHAR(50), -- Teacher's Email Address
  CONSTRAINT TeachersPK PRIMARY KEY (Teacher_ID), -- Primary Key Constraint
  CONSTRAINT T_FN_NN CHECK(First_Name IS NOT NULL), -- First Name Not Null Constraint
  CONSTRAINT T_LN_NN CHECK(Last_Name IS NOT NULL), -- Last Name Not Null Constraint
  CONSTRAINT T_EMAIL_UNIQUE UNIQUE(Email), -- Email Unique Constraint
);
