import {Lesson} from './lesson.model';

export class Planning {
    idPlanning: number;
    date: Date;
    startTime: string;
    endTime: string;
    lesson: Lesson;

    constructor() {
        this.idPlanning = 0;
        this.date = new Date();
        this.startTime = '';
        this.endTime = '';
        this.lesson = new Lesson();
    }

    set(obj: any, lesson: Lesson) {
        this.idPlanning = obj.idPlanning;
        this.date = obj.date;
        this.startTime = obj.startTime;
        this.endTime = obj.endTime;
        this.lesson = lesson;
    }
}
