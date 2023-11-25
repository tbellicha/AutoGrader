import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

import ClassTable from '../components/ClassTable';
import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../components/AuthContext';
import StudentInfo from '../types/StudentInfo';
import { getCourseInfo, getStudentInfo } from '../services/StudentDashboardService';

const StudentDashboard: React.FC<any> = () => {
    const auth = useAuth();
    const studentId = auth.studentId ?? "";
    const authToken = auth.token ?? "";

    const [loading, setLoading] = useState<boolean>(true);
    const [studentInfo, setStudentInfo] = useState<StudentInfo>();
    const [courseCodes, setCourseCodes] = useState<string[]>([]);
    const [courseNames, setCourseNames] = useState<string[]>([]);

    const zip = <T, U>(arr1: T[], arr2: U[]): [number, T, U][] => {
        const length = Math.min(arr1.length, arr2.length);
        return Array.from({ length }, (_, i) => [i, arr1[i], arr2[i]]);
    };

    useEffect(() => {
        setLoading(true);

        getStudentInfo(studentId, authToken)
            .then((data: unknown) => {
                const student: StudentInfo = (data as { student: StudentInfo }).student;
                setStudentInfo(student);
                const courseIds: string[] = [];

                student ?? console.log(`Student: ${studentInfo} is null!`);

                student.Enrollments.forEach(enrollment => courseIds.push(enrollment.course_id));

                return Promise.resolve(courseIds);
            })
            .then((data: unknown) => {
                const courseIds: string[] = (data as string[]);

                console.log(courseIds);

                const coursePromises: Promise<unknown>[] = courseIds.map((courseId) => getCourseInfo(courseId, authToken));
                return Promise.all(coursePromises);
            })
            .then((data: unknown[]) => {
                const courseCodes: string[] = [];
                const courseNames: string[] = [];

                data.forEach((obj: unknown) => {
                    const courseInfo = (obj as { course: { course_code: string, course_name: string } })?.course;
                    courseCodes.push(courseInfo.course_code);
                    courseNames.push(courseInfo.course_name);
                });

                setCourseCodes(courseCodes);
                setCourseNames(courseNames);

                zip(courseCodes, courseNames).forEach((course) => console.log(course));

                setLoading(false);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <>
            {/* Navigation Bar */}
            <StudentNavbar />
            {/*  Course Menu */}
            {
                loading ? (<p className="mt-3">Loading...</p>) : (
                    <ClassTable classTuple={zip(courseCodes, courseNames)} />
                )
            }
        </>
    );
};

export default StudentDashboard;