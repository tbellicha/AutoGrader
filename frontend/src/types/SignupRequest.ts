// Type: Interface, Definiton: SignupRequest
// Set of properties that are required to create a new user

/**
 * Represents a request to sign up a new user.
 */
interface SignupRequest {
    /** The email address of the user. */
    email: string;

    /** The first name of the user. */
    first_name: string;

    /** The last name of the user. */
    last_name: string;

    /** The password of the user. */
    password: string;
}