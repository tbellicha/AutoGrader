import Login from './views/Login';
import Signup from './views/Signup';
import Upload from './views/Upload';
import StudentDashboard from './views/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

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
    },
    {
        path: '/student',
        component: StudentDashboard,
    },
    {
        path: '/teacher',
        component: TeacherDashboard,
    }
];

export default routes;