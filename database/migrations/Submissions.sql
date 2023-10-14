CREATE TABLE Submissions(
    Submission_ID INT AUTO_INCREMENT, -- ID number for submission,
    Assignment_ID INT, -- Foreign Key to Assignments Table
    Student_ID INT, -- Foreign Key to Students Table
    Submission_Date DATETIME, -- Submission Date
    Score INT, -- Score
    Comments VARCHAR(250), -- Comments
    CONSTRAINT SubmissionsPK PRIMARY KEY (Submission_ID), -- Primary Key Constraint
    CONSTRAINT SU_DATE_NN CHECK(Submission_Date IS NOT NULL), -- Submission Date Not Null Constraint
    CONSTRAINT SU_SCORE_NN CHECK(Score IS NOT NULL), -- Score Not Null Constraint
    CONSTRAINT SU_COMMENTS_NN CHECK(Comments IS NOT NULL), -- Comments Not Null Constraint
    CONSTRAINT SU_ASSIGNMENT_FK FOREIGN KEY (Assignment_ID) REFERENCES Assignments(Assignment_ID), -- Foreign Key Constraint
    CONSTRAINT SU_STUDENT_FK FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID) -- Foreign Key Constraint
);