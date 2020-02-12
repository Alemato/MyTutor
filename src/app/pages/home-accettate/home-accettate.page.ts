import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {BookingService, Lez} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-home-accettate',
    templateUrl: './home-accettate.page.html',
    styleUrls: ['./home-accettate.page.scss'],
})
export class HomeAccettatePage implements OnInit {
    private agg = true;
    private loading;
    private tipo;
    private bookings$: BehaviorSubject<Booking[]>;
    private student$: BehaviorSubject<Student>;
    private teacher$: BehaviorSubject<Teacher>;
    private listLez$: BehaviorSubject<Lez[]>;

    public lezioni = [];
    private cancelLessonHeader: string;
    private confirmSubHeader: string;
    private cancelLessonMessage: string;
    private cancelButton: string;
    private pleaseWaitMessage: string;

    constructor(public alertController: AlertController,
                private userService: UserService,
                private bookingService: BookingService,
                public loadingController: LoadingController,
                public translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.tipo = this.userService.getTypeUser();
        if (this.tipo === 'student') {
            this.student$ = this.userService.getUser() as BehaviorSubject<Student>;
            // fa la get con un periodo di 1 minuto
        } else if (this.tipo === 'teacher') {
            this.teacher$ = this.userService.getUser() as BehaviorSubject<Teacher>;
        }
        this.listLez$ = this.bookingService.getListaLezioni();
        this.bookings$ = this.bookingService.getBookings();
        this.listLez$.subscribe((l) => {
            this.lezioni = [];
            l.forEach((item) => {

                if (item.lessonState === 1) {
                    this.lezioni.push(item);
                }
            });
        });
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter home-home/accetta');
        if (this.agg) {
            this.loadingPresent().then(() => {
                this.bookingService.getRestBooking().subscribe(() => {
                    this.disLoading();
                });
            });
            this.agg = false;
        }
    }


    ionViewDidLeave() {
        console.log('ionViewDidLeave home-home/accetta');
        this.agg = true;
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
                        this.loadingPresent().then(() => {
                            this.bookingService.modifyRestLessonState(booking).subscribe((data) => {
                                console.log(data);
                                this.bookingService.getRestBooking().subscribe(() => {
                                    this.disLoading();
                                });
                            }, (error => {
                                console.log(error);
                            }));
                        });
                        item.close();
                    }
                }]
        });

        await alert.present();
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
