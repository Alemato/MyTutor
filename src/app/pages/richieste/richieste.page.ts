import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {BookingService} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';
import {AlertController} from '@ionic/angular';
import {Teacher} from '../../model/teacher.model';
import {Student} from '../../model/student.model';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.page.html',
    styleUrls: ['./richieste.page.scss'],
})
export class RichiestePage implements OnInit {
    private user$: BehaviorSubject<Student | Teacher>;
    private bookings$: BehaviorSubject<Booking[]>;
    private existBookings = false;
    private loading = true;

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

    /**
     * Eseguo la rest che mi ritorna la lista di booking
     */
    ngOnInit() {
        this.initTranslate();
        this.user$ = this.userService.getUser();
        this.bookings$ = this.bookingService.getBookings();
        this.bookings$.subscribe((bookings) => {
            this.loading = true;
            this.existBookings = false;
            for (const booking of bookings) {
                if (booking.lessonState === 0) {
                    this.existBookings = true;
                    break;
                }
            }
            this.loading = false;
        });
    }

    /**
     * Avvio periodo di aggiornamento dei booking
     */
    ionViewWillEnter() {
        this.bookingService.startPeriodicGet();
        this.bookingService.getRestBooking().subscribe();
        this.bookingService.startCoundown();
    }

    /**
     * Fermo il periodo di aggiornamento dei booking
     */
    ionViewWillLeave() {
        this.bookingService.stopPeriodicGet();
        this.bookingService.stopCoundown();
    }

    /**
     * presento l'alert controller per vedere se devo accettarre o meno quel booking
     * @param idbook id del booking
     */
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

    /**
     * Funzione di accettazione dei booking
     * @param idBok id del booking da accettare
     */
    accettaLezione(idBok: number) {
        const booking = this.bookings$.value.find(x => x.idBooking === idBok);
        booking.lessonState = 1;
        this.loading = true;
        this.bookingService.modifyRestLessonState(booking).subscribe((data) => {
            console.log(data);
            this.bookingService.getRestBooking().subscribe(() => {
            });
            this.loading = false;
        }, (error => {
            console.log(error);
            this.loading = false;
        }));
    }

    /**
     * Funzione di presentazione dell'alert controller per rifiutare il booking
     * @param idbook id del booking da rifiutare
     */
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

    /**
     * funzione per iter di rifiuto del booking
     * @param idBok id booking
     */
    rifiutaLezione(idBok: number) {
        const booking = this.bookings$.value.find(x => x.idBooking === idBok);
        booking.lessonState = 2;
        this.bookingService.modifyRestLessonState(booking).subscribe((data) => {
            this.loading = true;
            console.log(data);
            this.bookingService.getRestBooking().subscribe(() => {
                this.loading = false;
            });
        }, (error => {
            console.log(error);
            this.loading = false;
        }));
    }

    /**
     * funzione di presentazione dell' allert controlle per l'annllamento della lezione
     * @param item item
     * @param id del booking
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
                        const booking = this.bookings$.value.find(x => x.idBooking === id);
                        booking.lessonState = 3;
                        this.loading = true;
                        this.bookingService.modifyRestLessonState(booking).subscribe((data) => {
                            console.log(data);
                            this.bookingService.getRestBooking().subscribe(() => {
                                this.loading = false;
                            });
                        }, (error => {
                            console.log(error);
                            this.loading = false;
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
