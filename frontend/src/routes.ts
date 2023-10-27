import Login from './views/Login';
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
    }
];

export default routes;