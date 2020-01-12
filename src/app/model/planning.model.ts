import {Lesson} from './lesson.model';

export class Planning {
    idPlanning: number;
    date: Date;
    startTime: string;
    endTime: string;
    lesson: Lesson;

    constructor(obj: any, lesson: Lesson) {
        if (obj !== undefined) {
            if (obj.idPlanning !== undefined) {
                this.idPlanning = obj.idPlanning;
            } else {
                this.idPlanning = 0;
            }
            if (obj.date !== undefined) {
                this.date = obj.date;
            } else {
                this.date = new Date();
            }
            if (obj.startTime !== undefined) {
                this.startTime = obj.startTime;
            } else {
                this.startTime = '';
            }
            if (obj.endTime !== undefined) {
                this.endTime = obj.endTime;
            } else {
                this.endTime = '';
            }
        } else {
            this.idPlanning = 0;
            this.date = new Date();
            this.startTime = '';
            this.endTime = '';
        }
        if (lesson !== undefined) {
            this.lesson = lesson;
        } else {
            this.lesson = new Lesson(undefined, undefined, undefined);
        }
    }

    set(obj: any, lesson: Lesson) {
        if (obj !== undefined) {
            if (obj.idPlanning !== undefined) {
                this.idPlanning = obj.idPlanning;
            }
            if (obj.date !== undefined) {
                this.date = obj.date;
            }
            if (obj.startTime !== undefined) {
                this.startTime = obj.startTime;
            }
            if (obj.endTime !== undefined) {
                this.endTime = obj.endTime;
            }
        }
        if (lesson !== undefined) {
            this.lesson = lesson;
        }
    }
}
