import {Subject} from './subject.model';
import {Teacher} from './teacher.model';

export class Lesson {
    idLesson: number;
    name: string;
    price: number;
    description: string;
    publicationDate: Date;
    subject: Subject;
    teacher: Teacher;

    constructor(obj: any, subject: Subject, teacher: Teacher) {
        if (obj !== undefined) {
            if (obj.idLesson !== undefined) {
                this.idLesson = obj.idLesson;
            } else {
                this.idLesson = 0;
            }
            if (obj.name !== undefined) {
                this.name = obj.name;
            } else {
                this.name = '';
            }
            if (obj.price !== undefined) {
                this.price = obj.price;
            } else {
                this.price = 0;
            }
            if (obj.description !== undefined) {
                this.description = obj.description;
            } else {
                this.description = '';
            }
            if (obj.publicationDate !== undefined) {
                this.publicationDate = obj.publicationDate;
            } else {
                this.publicationDate = new Date();
            }
        } else {
            this.idLesson = 0;
            this.name = '';
            this.price = 0;
            this.description = '';
            this.publicationDate = new Date();
        }
        if (subject !== undefined) {
            this.subject = subject;
        } else {
            this.subject = new Subject(undefined);
        }
        if (teacher !== undefined) {
            this.teacher = teacher;
        } else {
            this.teacher = new Teacher(undefined);
        }
    }

    set(obj: any, subject: Subject, teacher: Teacher) {
        if (obj !== undefined) {
            if (obj.idLesson !== undefined) {
                this.idLesson = obj.idLesson;
            }
            if (obj.name !== undefined) {
                this.name = obj.name;
            }
            if (obj.price !== undefined) {
                this.price = obj.price;
            }
            if (obj.description !== undefined) {
                this.description = obj.description;
            }
            if (obj.publicationDate !== undefined) {
                this.publicationDate = obj.publicationDate;
            }
        }
        if (subject !== undefined) {
            this.subject = subject;
        }
        if (teacher !== undefined) {
            this.teacher = teacher;
        }
    }
}
