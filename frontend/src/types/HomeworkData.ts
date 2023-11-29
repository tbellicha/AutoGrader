// Type definitions for HomeworkData.
/**
 * Represents the details of a test.
 * @Type {TestDetails}
 * @property {string} name The name of the test.
 * @property {string} case The test case.
 * @property {boolean} result The result of the test.
 */
export type TestDetails = {
    /**
     * The name of the test.
     */
    name: string;
    /**
     * The test case.
     */
    case: string;
    /**
     * The result of the test.
     */
    result: boolean;
    /**
     * The points awarded for the test.
     */
    points: number;
};

/**
 * Represents the data for a homework assignment.
 * @Type {HomeworkData}
 * @property {string} elapsedTime The elapsed time for the homework assignment.
 * @property {number} homeworkTotal The total number of homework assignments.
 * @property {string} peakMem The peak memory usage for the homework assignment.
 * @property {string} studentPercentage The percentage of students who completed the homework assignment.
 * @property {number} studentsTotal The total number of students.
 */
export type HomeworkData = {
    /**
     * The elapsed time for the homework assignment.
     */
    elapsedTime: string;
    /**
     * The total number of homework assignments.
     */
    homeworkTotal: number;
    /**
     * The peak memory usage for the homework assignment.
     */
    peakMem: string;
    /**
     * The percentage of students who completed the homework assignment.
     */
    studentPercentage: string;
    /**
     * The total number of students.
     */
    studentsTotal: number;
    /**
     * The details of the tests for the homework assignment.
     */
    tests: TestDetails[];
};