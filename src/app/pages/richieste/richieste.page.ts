import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {BookingService} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.page.html',
    styleUrls: ['./richieste.page.scss'],
})
export class RichiestePage implements OnInit {
    private user$: BehaviorSubject<User>;
    private bookings$: BehaviorSubject<Booking[]>;
    private existBookings = false;

    private confirmLessonHeader: string;
    private confirmSubHeader: string;
    private confirmLessonMessage: string;
    private cancelButton: string;
    private declineLessonHeader: string;
    private declineLessonMessage: string;
    private cancelLessonHeader: string;
    private cancelLessonMessage: string;
    private pleaseWaitMessage: string;

    constructor(private userService: UserService,
                private bookingService: BookingService,
                private alertController: AlertController,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.user$ = this.userService.getUser();
        this.bookings$ = this.bookingService.getBookings();
        this.bookings$.subscribe((bookings) => {
          this.existBookings = false;
          for (const booking of bookings) {
                if (booking.lessonState === 0) {
                    this.existBookings = true;
                    break;
                }
            }
        });
    }

    ionViewWillEnter() {
        this.bookingService.startPeriodicGet();
        this.bookingService.getRestBooking().subscribe();
        this.bookingService.startCoundown();
    }

    ionViewWillLeave() {
        this.bookingService.stopPeriodicGet();
        this.bookingService.stopCoundown();
    }

    async presentAlertAccettaLezione(idbook) {
        const alert = await this.alertController.create({
            header: this.confirmLessonHeader,
            subHeader: this.confirmSubHeader,
            message: this.confirmLessonMessage,
            buttons: [
                {
                    text: this.cancelButton,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Annulla operazione');
                    }
                }, {
                    text: 'OK',
                    handler: () => {
                        this.accettaLezione(idbook);
                    }
                }]
        });

        await alert.present();
    }

    accettaLezione(idBok: number) {
        const booking = this.bookings$.value.find(x => x.idBooking === idBok);
        booking.lessonState = 1;
        this.bookingService.modifyRestLessonState(booking).subscribe((data) => {
            console.log(data);
            this.bookingService.getRestBooking().subscribe(() => {
            });
        }, (error => {
            console.log(error);
        }));
    }

    async presentAlertRifiutaLezione(idbook) {
        const alert = await this.alertController.create({
            header: this.declineLessonHeader,
            subHeader: this.confirmSubHeader,
            message: this.declineLessonMessage,
            buttons: [
                {
                    text: this.cancelButton,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Annulla operazione');
                    }
                }, {
                    text: 'OK',
                    handler: () => {
                        this.rifiutaLezione(idbook);
                    }
                }]
        });

        await alert.present();
    }

    rifiutaLezione(idBok: number) {
        const booking = this.bookings$.value.find(x => x.idBooking === idBok);
        booking.lessonState = 2;
        this.bookingService.modifyRestLessonState(booking).subscribe((data) => {
            console.log(data);
            this.bookingService.getRestBooking().subscribe(() => {
            });
        }, (error => {
            console.log(error);
        }));
    }

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
                        const booking = this.bookings$.value.find(x => x.idBooking === id);
                        booking.lessonState = 3;
                        this.bookingService.modifyRestLessonState(booking).subscribe((data) => {
                            console.log(data);
                            this.bookingService.getRestBooking().subscribe(() => {
                            });
                        }, (error => {
                            console.log(error);
                        }));
                        item.close();
                    }
                }]
        });

        await alert.present();
    }

    initTranslate() {
        this.translateService.get('CONFIRM_LESSON_HEADER').subscribe((data) => {
            this.confirmLessonHeader = data;
        });
        this.translateService.get('CONFIRM_SUBHEADER').subscribe((data) => {
            this.confirmSubHeader = data;
        });
        this.translateService.get('CONFIRM_LESSON_MESSAGE').subscribe((data) => {
            this.confirmLessonMessage = data;
        });
        this.translateService.get('CANCEL_BUTTON').subscribe((data) => {
            this.cancelButton = data;
        });
        this.translateService.get('DECLINE_LESSON_HEADER').subscribe((data) => {
            this.declineLessonHeader = data;
        });
        this.translateService.get('DECLINE_LESSON_MESSAGE').subscribe((data) => {
            this.declineLessonMessage = data;
        });
        this.translateService.get('CANCEL_LESSON_HEADER').subscribe((data) => {
            this.cancelLessonHeader = data;
        });
        this.translateService.get('CANCEL_LESSON_MESSAGE').subscribe((data) => {
            this.cancelLessonMessage = data;
        });
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
    }
}
