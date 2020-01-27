import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {BookingService, Lez} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';

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
        console.log('ionViewWillEnter home/accetta');
        if (this.agg) {
            this.loadingPresent().then(() => {
                // this.getlezioni();
                this.bookingService.getRestBooking().subscribe(() => {
                    this.disLoading();
                });
            });
            this.agg = false;
        }
    }


    ionViewDidLeave() {
        console.log('ionViewDidLeave home/accetta');
        this.agg = true;
    }

    async presentAlert(item, id) {
        const alert = await this.alertController.create({
            header: 'Annullare la Lezione',
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
}
