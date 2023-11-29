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
 * @property {string} elapsedTime The elapsed time the container executed for.
 * @property {number} homeworkTotal The total number of points for this assignment.
 * @property {string} peakMem The peak memory usage during runtime.
 * @property {string} studentPercentage The score as a percentage.
 * @property {number} studentsTotal The total number of points earned.
 */
export type HomeworkData = {
    /**
     * The elapsed time the container executed for.
     */
    elapsedTime: string;

    /**
     * The total number of points for this assignment.
     */
    homeworkTotal: number;

    /**
     * The peak memory usage during runtime.
     */
    peakMem: string;

    /**
     * The students' score as a percentage.
     */
    studentPercentage: string;

    /**
     * The total number of points earned.
     */
    studentsTotal: number;

    /**
     * The details of the tests for the homework assignment.
     */
    tests: TestDetails[];
};