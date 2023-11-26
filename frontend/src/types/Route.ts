// Role type for routes
// unspecified role means the route is accessible to all users
// protected must be true for role to be used
// student and teacher are the only valid roles and mean the route is only accessible to students or teachers respectively
type Role = "STUDENT" | "TEACHER";

/**
 * Represents a route in the application.
 */
interface Route {
    /**
     * The path of the route.
     */
    path: string;
    /**
     * The component to render for the route.
     */
    component: React.ComponentType<any>;
    /**
     * Whether the route should match exactly.
     */
    exact?: boolean;

    /**
     * Whether the route should be protected.
     */
    protected?: boolean;

    /**
     * The user role required to access the route.
     * protected must be true for this to be used.
     * If not provided, the route is accessible to all users.
     * If provided, the route is only accessible to users with the specified role.
     * /login and /signup are always accessible.
    */
    role?: Role;
}