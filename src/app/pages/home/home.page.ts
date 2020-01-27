import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {UserService} from '../../services/user.service';
import {Lez, BookingService} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';
import {LoadingController} from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    private num: number;
    private loading;
    private lezioni = [];
    private student$: BehaviorSubject<Student>;
    private teacher$: BehaviorSubject<Teacher>;
    private bookings$: BehaviorSubject<Booking[]>;
    private pleaseWaitMessage: string;

    constructor(private userService: UserService,
                private bookingService: BookingService,
                public loadingController: LoadingController,
                public translateService: TranslateService,   // mi serve per la lingua
    ) {
    }

    ngOnInit() {
        const tipo = this.userService.getTypeUser();
        if (tipo === 'student') {
            this.student$ = this.userService.getUser();
        } else if (tipo === 'teacher') {
            this.teacher$ = this.userService.getUser();
        }
        this.bookings$ = this.bookingService.getBookings();
        this.bookings$.subscribe(() => {
            console.log('home subscribe');
            this.lezioni = [];
            this.setArrayLezioni();
        });
        this.initTranslate();
    }

    setArrayLezioni() {
        this.num = 0;
        this.bookings$.value.forEach((item) => {
            if (item.lessonState === 1 || item.lessonState === 0) {
                if (item.lessonState === 0) {
                    this.num++;
                }
                const [h, m, s] = item.planning.startTime.split(':');
                const data = new Date(item.planning.date);
                data.setHours(+h);
                data.setMinutes(+m);
                data.setSeconds(+s);
                const lezioneSingola: Lez = {
                    idbook: item.idBooking,
                    idPlanning: item.planning.idPlanning,
                    lessonState: item.lessonState,
                    nomeLezione: item.planning.lesson.name,
                    price: item.planning.lesson.price,
                    nomeProf: item.planning.lesson.teacher.name + ' ' + item.planning.lesson.teacher.surname,
                    emailProf: item.planning.lesson.teacher.email,
                    imgProf: item.planning.lesson.teacher.image,
                    nomeStudent: item.student.name + ' ' + item.student.surname,
                    emailStudent: item.student.email,
                    imgStudent: item.student.image,
                    date: data.getTime(),
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                };
                this.lezioni.push(lezioneSingola);
            }
        });
        this.bookingService.setListaLezioni(this.lezioni);
    }

    async loadingPresent() {
        this.loading = await this.loadingController.create({
            message: this.pleaseWaitMessage,
            translucent: true
        });
        return await this.loading.present();
    }

    async disLoading() {
        await this.loading.dismiss();
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter home');
        this.bookingService.setListaLezioni(this.lezioni);
        this.bookingService.startCoundown();
        this.bookingService.startPeriodicGet();
    }

    ionViewDidLeave() {
        console.log('ionViewDidLeave home');
        this.bookingService.stopCoundown();
        this.bookingService.stopPeriodicGet();
    }

    private initTranslate() {
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
    }

}
