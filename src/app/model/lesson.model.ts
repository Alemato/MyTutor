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


    set(obj: any, subject: Subject, teacher: Teacher) {
        this.idLesson = obj.idLesson;
        this.name = obj.name;
        this.price = obj.price;
        this.description = obj.description;
        this.publicationDate = obj.publicationDate;
        this.subject = subject;
        this.teacher = teacher;
    }

    constructor() {
        this.idLesson = 0;
        this.name = '';
        this.price = 0;
        this.description = '';
        this.publicationDate = new Date();
        this.subject = new Subject();
        this.teacher = new Teacher();
    }
}
