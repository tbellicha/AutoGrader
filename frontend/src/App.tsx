import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import routes from "./routes";
import { AuthProvider } from "./components/AuthContext";

import "./App.css";
import { UserProvider } from "./components/UserContext";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => {
    return (
        <>
            <AuthProvider>
                <Router>
                    <UserProvider>
                        <Routes>
                            {routes.map((route, index) => (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        route.protected ? (
                                            <PrivateRoute
                                                component={route.component}
                                                role={route.role}
                                            />) : (
                                            <route.component />
                                        )
                                    }
                                />))}
                        </Routes>
                    </UserProvider>
                </Router>
            </AuthProvider>
        </>
    );
};

export default App;
