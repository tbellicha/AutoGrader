import StudentEnrollment from './components/StudentEnrollment';
import CourseCreation from './components/CourseCreation';
import AssignmentCreation from './components/AssignmentCreation';
import TeacherDashboard from './components/TeacherDashboard';
import CourseDetails from './components/CourseDetails';
import Login from './views/Login';
import Signup from './views/Signup';
import StudentDashboard from './views/StudentDashboard';

const routes: Route[] = [
    {
        path: '/',
        component: Login,
        exact: true
    },
    {
        path: '/signup',
        component: Signup,
    },
    {
        path: '/TeacherDashboard',
        component: TeacherDashboard,
    },
    {
        path: '/StudentEnrollment',
        component: StudentEnrollment,
    },
    {
        path: '/CourseCreation',
        component: CourseCreation,
    },
    {
        path: '/AssignmentCreation',
        component: AssignmentCreation,
    },
    {
        path: '/course/:id',
        component: CourseDetails,
    },
    {
        path: '/StudentDashboard',
        component: StudentDashboard,
    },
];

export default routes;
