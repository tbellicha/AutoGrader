/**
 * Represents an assignment
 * @type Assigment
 * @property {string} id - The ID of the assignment.
 * @property {string} course_id - The ID of the course.
 * @property {string} title - The title of the assignment.
 * @property {string} description - The description of the assignment.
 * @property {string} due_date - The due date of the assignment.
 */
export type Assignment = {
    id: string;
    course_id: string;
    title: string;
    description: string;
    due_date: string;
};

/**
 * Represents a list of assignments
 * @type Assigments
 */
export type Assignments = Assignment[];