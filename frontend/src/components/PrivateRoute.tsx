import React from "react";

import { useUser } from "./UserContext";

import { Navigate } from "react-router-dom";

const PrivateRoute: React.FC<{ component: React.ComponentType<any>; role?: Role }> = ({ component: Component, role, ...props }) => {
    const { user } = useUser();

    if (!user) {
        return <Navigate to="/" />;
    }

    if (role && role !== user.role) {
        return <Navigate to="/unauthorized" />;
    }

    return <Component {...props} />;
};

export default PrivateRoute;