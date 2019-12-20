import {Lesson} from './lesson.model';

export interface Prenotazione {
    idBooking: number;
    date: Date;
    startTime: string;
    endTime: string;
    lesson: Lesson;
}

export class Booking {
    idBooking: number;
    date: Date;
    startTime: string;
    endTime: string;
    lesson: Lesson;

    // public constructor(booking: any) {
    //     this.idBooking = booking.idBooking;
    //     this.date = new Date(booking.date.toLocaleDateString());
    //     this.startTime = booking.startTime;
    //     this.endTime = booking.endTime;
    //     this.lesson = new Lesson(booking.lesson);
    // }
}
