import {Lesson} from './lesson.model';

export class Planning {
    idPlanning: number;
    date: number;
    startTime: string;
    endTime: string;
    available: boolean;
    repeatPlanning: boolean;
    lesson: Lesson;

}
