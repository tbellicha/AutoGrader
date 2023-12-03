import { Assignment } from "./Assignments";
import { HomeworkData } from "./HomeworkData";

export type ServerResponse = {
    assignment: Assignment;
    homeworkData: HomeworkData;
};