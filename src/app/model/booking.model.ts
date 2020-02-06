import {Student} from './student.model';
import {Planning} from './planning.model';

export class Booking {
    idBooking: number;
    date: Date;
    lessonState: number;
    student: Student;
    planning: Planning;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
