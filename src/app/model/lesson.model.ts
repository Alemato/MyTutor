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

}
