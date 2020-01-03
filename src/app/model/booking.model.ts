import {Student} from './student.model';
import {Planning} from './planning.model';

export class Booking {
    idBooking: number;
    date: Date;
    lessonState: number;
    student: Student;
    planning: Planning;

    constructor() {
        this.idBooking = 0;
        this.date = new Date();
        this.lessonState = 3;
        this.student = new Student();
        this.planning = new Planning();
    }

    set(obj: any, student: Student, planning: Planning) {
        this.idBooking = obj.idBooking;
        this.date = obj.date;
        this.lessonState = obj.lessonState;
        this.student = student;
        this.planning = planning;
    }
}
