import Login from './views/Login';
import Signup from './views/Signup';
import Upload from './views/Upload';

const routes: Route[] = [
    {
        path: '/',
        component: Login,
        exact: true
    },
    {
        path: '/dashboard',
        component: Upload,
    },
    {
        path: '/signup',
        component: Signup,
    }
];

export default routes;