export interface Course {
  id: string;
  course_name: string;
  course_code: string;
  teacher_id: number;
  Assignments: Assignment[];
  Enrollments: Enrollment[];
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  Enrollments: Enrollment[];
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
}
