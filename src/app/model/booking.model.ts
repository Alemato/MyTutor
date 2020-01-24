import {Student} from './student.model';
import {Planning} from './planning.model';

export class Booking {
    idBooking: number;
    date: Date;
    lessonState: number;
    student: Student;
    planning: Planning;

    constructor(obj: any, student: Student, planning: Planning) {
        if (obj !== undefined) {
            if (obj.idBooking !== undefined) {
                this.idBooking = obj.idBooking;
            } else {
                this.idBooking = 0;
            }
            if (obj.date !== undefined) {
                this.date = obj.date;
            } else {
                this.date = new Date();
            }
            if (obj.lessonState !== undefined) {
                this.lessonState = obj.lessonState;
            } else {
                this.lessonState = 3;
            }
        } else {
            this.idBooking = 0;
            this.date = new Date();
            this.lessonState = 3;
        }
        if (student !== undefined) {
            this.student = student;
        } else {
            this.student = new Student(undefined);
        }
        if (planning !== undefined) {
            this.planning = planning;
        } else {
            this.planning = new Planning(undefined, undefined);
        }
    }

    set(obj: any, student: Student, planning: Planning) {
        if (obj !== undefined) {
            if (obj.idBooking !== undefined) {
                this.idBooking = obj.idBooking;
            }
            if (obj.date !== undefined) {
                this.date = obj.date;
            }
            if (obj.lessonState !== undefined) {
                this.lessonState = obj.lessonState;
            }
        }
        if (student !== undefined) {
            this.student = student;
        }
        if (planning !== undefined) {
            this.planning = planning;
        }
    }
}
