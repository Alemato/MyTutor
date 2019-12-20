import {Materia, Subject} from './subject.model';

export interface Lezione {
    idLesson: number;
    name: string;
    price: number;
    description: string;
    publicationDate: Date;
    subject: Materia;
    teacher: {idTeacher: number, nameTeacher: string, surnameTeacher: string};
}

export class Lesson {
    idLesson: number;
    name: string;
    price: number;
    description: string;
    publicationDate: Date;
    subject: Subject;
    teacher: {idTeacher: number, nameTeacher: string, surnameTeacher: string};

    // public constructor(lesson: any) {
    //     this.idLesson = lesson.idLesson;
    //     this.name = lesson.name;
    //     this.price = lesson.price;
    //     this.description = lesson.description;
    //     this.publicationDate = new Date(lesson.publicationDate.toLocaleDateString());
    //     this.subject = new Subject(lesson.subject);
    //     this.teacher.idTeacher = lesson.teacher.idTeacher;
    //     this.teacher.nameTeacher = lesson.teacher.nameTeacher;
    //     this.teacher.surnameTeacher = lesson.teacher.surnameTeacher;
    // }
}
