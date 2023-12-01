import AssignmentCreation from './components/AssignmentCreation';
import AssignmentResults from './views/AssignmentResults';
import CourseCreation from './components/CourseCreation';
import CourseDetails from './components/CourseDetails';
import Login from './views/Login';
import Signup from './views/Signup';
import StudentAssignments from './views/StudentAssignments';
import StudentDashboard from './views/StudentDashboard';
import StudentEnrollment from './components/StudentEnrollment';
import TeacherDashboard from './components/TeacherDashboard';

const STUDENT = "STUDENT";
const TEACHER = "TEACHER";

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
        protected: true,
        role: TEACHER,
    },
    {
        path: '/StudentEnrollment',
        component: StudentEnrollment,
        protected: true,
        role: TEACHER,
    },
    {
        path: '/CourseCreation',
        component: CourseCreation,
        protected: true,
        role: TEACHER,
    },
    {
        path: '/AssignmentCreation',
        component: AssignmentCreation,
        protected: true,
        role: TEACHER,
    },
    {
        path: '/course/:id',
        component: CourseDetails,
        protected: true,
        role: TEACHER,
    },
    {
        path: '/StudentDashboard',
        component: StudentDashboard,
        protected: true,
        role: STUDENT,
    },
    {
        path: '/StudentAssignments',
        component: StudentAssignments,
        protected: true,
        role: STUDENT,
    },
    {
        path: '/AssignmentResults',
        component: AssignmentResults,
        protected: true,
        role: STUDENT,
    }
];

export default routes;
