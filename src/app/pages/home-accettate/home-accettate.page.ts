import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {BookingService} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';

@Component({
    selector: 'app-home-accettate',
    templateUrl: './home-accettate.page.html',
    styleUrls: ['./home-accettate.page.scss'],
})
export class HomeAccettatePage implements OnInit {
    private countDowns: Subscription;
    private getBokingPeriodic: Subscription;
    private loading;
    private tipo;
    private bookings$: BehaviorSubject<Booking[]>;
    private student$: BehaviorSubject<Student>;
    private teacher$: BehaviorSubject<Teacher>;

    public lezioni = [];

    constructor(public alertController: AlertController,
                private userService: UserService,
                private bookingService: BookingService,
                public loadingController: LoadingController) {
    }

    ngOnInit() {
        this.tipo = this.userService.getTypeUser();
        console.log(this.tipo);
        if (this.tipo === 'student') {
            this.student$ = this.userService.getUser();
            // fa la get con un periodo di 1 minuto
        } else if (this.tipo === 'teacher') {
            this.teacher$ = this.userService.getUser();
        }
        this.loadingPresent().then(() => {
            this.bookings$ = this.bookingService.getBookings();
            this.getlezioni();
        });
    }

    getlezioni() {
        this.bookingService.getRestBooking().subscribe((date) => {
            console.log(date);
            this.lezioni = [];
            this.setArrayLezioni();
            this.countDown();
            this.disLoading().then(() => {
            });
        });
    }

    setArrayLezioni() {
        this.bookings$.value.forEach((item) => {
            if (item.lessonState === 1) {
                const lezioneSingola = {
                    idbok: 0,
                    lessonState: 0,
                    nomeLezione: '',
                    price: 0,
                    nomeProf: '',
                    emailProf: '',
                    imgProf: '',
                    nomeStudent: '',
                    emailStudent: '',
                    imgStudent: '',
                    date: 0,
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                };
                lezioneSingola.idbok = item.idBooking;
                lezioneSingola.lessonState = item.lessonState;
                lezioneSingola.nomeLezione = item.planning.lesson.name;
                lezioneSingola.price = item.planning.lesson.price;
                lezioneSingola.nomeProf = item.planning.lesson.teacher.name + ' ' + item.planning.lesson.teacher.surname;
                lezioneSingola.emailProf = item.planning.lesson.teacher.email;
                lezioneSingola.imgProf = item.planning.lesson.teacher.image;
                lezioneSingola.nomeStudent = item.student.name + ' ' + item.student.surname;
                lezioneSingola.emailStudent = item.student.email;
                lezioneSingola.imgStudent = item.student.image;
                const [h, m, s] = item.planning.startTime.split(':');
                const data = new Date(item.planning.date);
                data.setHours(+h);
                data.setMinutes(+m);
                data.setSeconds(+s);
                lezioneSingola.date = data.getTime();
                this.lezioni.push(lezioneSingola);
            }
        });
    }

    countDown() {
        this.lezioni.forEach((item) => {
            const nowDate = new Date().getTime();
            const distance = item.date - nowDate;
            item.days = Math.floor(distance / (1000 * 60 * 60 * 24));
            item.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            item.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            item.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        });
    }

    ionViewWillEnter() {
        this.countDowns = interval(800).subscribe(x => {
            this.countDown();
        });
        this.getBokingPeriodic = interval(60000).subscribe(() => {
            this.getlezioni();
        });
    }

    ionViewDidLeave() {
        this.countDowns.unsubscribe();
        this.getBokingPeriodic.unsubscribe();
    }

    async presentAlert(item, id) {
        const alert = await this.alertController.create({
            header: 'Annullare la Lezzione',
            subHeader: 'Conferma',
            message: 'Sei sicuro di voler annullare la lezione?',
            buttons: [
                {
                    text: 'Annulla',
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
                        console.log(id);
                        const booking = this.bookings$.value.find(x => x.idBooking === id);
                        booking.lessonState = 4;
                        console.log(booking);
                        this.loadingPresent().then(() => {
                            this.bookingService.modifyRestLessonState(booking).subscribe((data) => {
                                console.log(data);
                                this.bookingService.getRestBooking().subscribe(() => {
                                    this.lezioni = [];
                                    this.setArrayLezioni();
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
            message: 'Please wait...',
            translucent: true
        });
        return await this.loading.present();
    }

    async disLoading() {
        await this.loading.dismiss();
    }

    addPrenotazioneLezione() {
        console.log('Vai a alla pagina per prenotare la lezione');
    }

}
