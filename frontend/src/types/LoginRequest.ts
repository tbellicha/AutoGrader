/**
 * Represents a login request object.
 */
interface LoginRequest {
    /**
     * The email of the user attempting to log in.
     */
    email: string;
    /**
     * The password of the user attempting to log in.
     */
    password: string;
}