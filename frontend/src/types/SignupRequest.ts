// Type: Interface, Definiton: SignupRequest
// Set of properties that are required to create a new user

/**
 * Represents a user signup request.
 */
interface SignupRequest {
    /** The email address of the user. */
    email: string;
    /** The password of the user. */
    password: string;
    /** The first name of the user. */
    firstName: string;
    /** The last name of the user. */
    lastName: string;
}