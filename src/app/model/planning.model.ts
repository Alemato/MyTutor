import {Lesson, Lezione} from './lesson.model';

export interface Pianificazione {
    idPlanning: number;
    date: number;
    startTime: string;
    endTime: string;
    lesson: Lezione;
}

export class Planning {
    idPlanning: number;
    date: Date;
    startTime: string;
    endTime: string;
    lesson: Lesson;
    // public constructor(planning: any) {
    //     this.idPlanning = planning.idPlanning;
    //     this.date = new Date(planning.date.toLocaleDateString());
    //     this.startTime = planning.startTime;
    //     this.endTime = planning.endTime;
    //     this.lesson = new Lesson(planning.lesson);
    // }
}
