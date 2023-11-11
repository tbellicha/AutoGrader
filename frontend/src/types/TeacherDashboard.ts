
export interface Course {
  id: number;
  course_name: string;
  course_code: string;
  teacher_id: number;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  course_id: number;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
}
