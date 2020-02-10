import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {BookingService} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';
import {AlertController} from '@ionic/angular';

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
    private user$: BehaviorSubject<User>;
    private booking$: BehaviorSubject<Booking[]>;
    private existbookings = false;

    constructor(public translateService: TranslateService,
                private userService: UserService,
                private bookingService: BookingService,
                private alertController: AlertController) {
    }

    ngOnInit() {
        this.initTranslate();
        this.user$ = this.userService.getUser();
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
                        this.bookingService.modifyRestLessonState(booking).subscribe(() => {
                            this.bookingService.getRestBooking().subscribe(() => {
                                item.close();
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
