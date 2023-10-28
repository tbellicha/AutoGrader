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
}