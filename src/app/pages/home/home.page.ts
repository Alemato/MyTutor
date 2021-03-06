import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../../services/user.service';
import {BookingService} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';
import {AlertController} from '@ionic/angular';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    private cancelLessonHeader: string;
    private confirmSubHeader: string;
    private cancelLessonMessage: string;
    private cancelButton: string;
    private pleaseWaitMessage: string;
    private user$: BehaviorSubject<Student | Teacher>;
    private booking$: BehaviorSubject<Booking[]>;
    private existbookings = false;
    private loading = true;

    constructor(public translateService: TranslateService,
                private userService: UserService,
                private bookingService: BookingService,
                private alertController: AlertController) {
    }

    ngOnInit() {
        this.initTranslate();
        this.user$ = this.userService.getUser();
        this.loading = true;
        this.bookingService.getRestBooking().subscribe(() => {
        });
        this.booking$ = this.bookingService.getBookings();
        this.booking$.subscribe((bookings) => {
            this.existbookings = false;
            for (const booking of bookings) {
                if (booking.lessonState === 1) {
                    this.existbookings = true;
                    break;
                }
            }
            this.loading = false;
        });
    }

    ionViewWillEnter() {
        this.bookingService.getRestBooking();
        this.bookingService.startPeriodicGet();
        this.bookingService.startCoundown();
    }

    ionViewWillLeave() {
        this.bookingService.stopPeriodicGet();
        this.bookingService.stopCoundown();
    }

    /**
     * alert che avviene quando voglio annullare una lezione
     * effetuo la rest di annulamento se deo annullare la lezione
     * @param item ?? l'item che ho cliccato
     * @param id ?? l'id della prenotazione del booking
     */
    async presentAlert(item, id) {
        const alert = await this.alertController.create({
            header: this.cancelLessonHeader,
            subHeader: this.confirmSubHeader,
            message: this.cancelLessonMessage,
            buttons: [
                {
                    text: this.cancelButton,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Annulla operazione');
                        item.close();
                    }
                }, {
                    text: 'OK',
                    handler: () => {
                        console.log('Conferma annullamento lezione');
                        const booking = this.booking$.value[id];
                        booking.lessonState = 3;
                        this.loading = true;
                        this.bookingService.modifyRestLessonState(booking).subscribe(() => {
                            this.bookingService.getRestBooking().subscribe(() => {
                                item.close();
                                this.loading = false;
                            });
                        });
                    }
                }]
        });

        await alert.present();
    }

    private initTranslate() {
        this.translateService.get('CANCEL_LESSON_HEADER').subscribe((data) => {
            this.cancelLessonHeader = data;
        });
        this.translateService.get('CONFIRM_SUBHEADER').subscribe((data) => {
            this.confirmSubHeader = data;
        });
        this.translateService.get('CANCEL_LESSON_MESSAGE').subscribe((data) => {
            this.cancelLessonMessage = data;
        });
        this.translateService.get('CANCEL_BUTTON').subscribe((data) => {
            this.cancelButton = data;
        });
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
    }
}
