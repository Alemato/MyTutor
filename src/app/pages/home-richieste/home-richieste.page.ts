import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {AlertController, LoadingController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {BookingService} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';

@Component({
  selector: 'app-home-richieste',
  templateUrl: './home-richieste.page.html',
  styleUrls: ['./home-richieste.page.scss'],
})
export class HomeRichiestePage implements OnInit {
  private agg = false;
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
      if (item.lessonState === 0) {
        const lezioneSingola = {
          idbook: 0,
          lessonState: 0,
          nomeLezione: '',
          nomeProf: '',
          emailProf: '',
          price: 0,
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
        lezioneSingola.idbook = item.idBooking;
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

  accettaLezione(idBok: number) {
    const booking = this.bookings$.value.find(x => x.idBooking === idBok);
    booking.lessonState = 1;
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
  }

  rifiutaLezione(idBok: number) {
    const booking = this.bookings$.value.find(x => x.idBooking === idBok);
    booking.lessonState = 2;
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
    if (this.agg) {
      this.loadingPresent().then(() => {
        this.getlezioni();
      });
      this.disLoading();
      this.agg = false;
    }
    this.countDowns = interval(800).subscribe(x => {
      this.countDown();
    });
    this.getBokingPeriodic = interval(60000).subscribe(() => {
      this.getlezioni();
    });
  }

  ionViewDidLeave() {
    this.agg = true;
    this.countDowns.unsubscribe();
    this.getBokingPeriodic.unsubscribe();
  }

  async presentAlertAccettaLezione(idbook) {
    const alert = await this.alertController.create({
      header: 'Conferma la Lezzione',
      subHeader: 'Conferma',
      message: 'Sei sicuro di voler accettare la lezione?',
      buttons: [
        {
          text: 'Annulla',
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

  async presentAlertRifiutaLezione(idbook) {
    const alert = await this.alertController.create({
      header: 'Rifiuta la Lezzione',
      subHeader: 'Conferma',
      message: 'Sei sicuro di voler rifiutare la lezione?',
      buttons: [
        {
          text: 'Annulla',
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

}
