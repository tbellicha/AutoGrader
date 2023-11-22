import Enrollments from "./Enrollments";

/**
 * Represents information about a student.
 */
type StudentInfo = {
    /**
     * The unique identifier of the student.
     */
    id: string;
    /**
     * The first name of the student.
     */
    firstName: string;
    /**
     * The last name of the student.
     */
    lastName: string;

    /**
     * The email address of the student.
     */
    email: string;

    /**
     * The enrollments of the student.
     */
    Enrollments: Enrollments;
};

export default StudentInfo;