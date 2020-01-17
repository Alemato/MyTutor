import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {UserService} from '../../services/user.service';
import {BookingService} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    private num: number;
    private student$: BehaviorSubject<Student>;
    private teacher$: BehaviorSubject<Teacher>;
    private bookings$: BehaviorSubject<Booking[]>;

    constructor(private userService: UserService,
                private bookingService: BookingService) {}

    setNumeroRichieste(booking) {
        this.num = 0;
        console.log(booking);
        this.bookings$.value.forEach((item) => {
            if (item.lessonState === 0) {
                this.num++;
            }
        });
    }

    ngOnInit() {
        const tipo = this.userService.getTypeUser();
        if (tipo === 'student') {
            this.student$ = this.userService.getUser();
        } else if (tipo === 'teacher') {
            this.teacher$ = this.userService.getUser();
        }
        this.bookings$ = this.bookingService.getBookings();
        this.bookings$.subscribe((booking) => {
            if (booking.length > 0) {
                this.setNumeroRichieste(booking);
            }
        });
    }

}
