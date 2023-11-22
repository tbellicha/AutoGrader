/**
 * Represents an enrollment record.
 * @type Enrollment
 * @property {string} id - The ID of the enrollment.
 * @property {string} studentId - The ID of the student.
 * @property {string} courseId - The ID of the course.
 */
type Enrollment = {
    /**
     * The ID of the enrollment.
     */
    id: string;

    /**
     * The ID of the student.
     */
    studentId: string;

    /**
     * The ID of the course.
     */
    courseId: string;
};

/**
 * Represents a list of enrollment records.
 * @type Enrollments
 * @property {Enrollment[]} - The list of enrollment records.
 */
type Enrollments = Enrollment[];

export default Enrollments;