import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {AlertController, LoadingController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {BookingService, Lez} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';

@Component({
  selector: 'app-home-richieste',
  templateUrl: './home-richieste.page.html',
  styleUrls: ['./home-richieste.page.scss'],
})
export class HomeRichiestePage implements OnInit {
  private agg = false;
  private loading;
  private tipo;
  private bookings$: BehaviorSubject<Booking[]>;
  private listLez$: BehaviorSubject<Lez[]>;
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
    this.listLez$ = this.bookingService.getListaLezioni();
    this.bookings$ = this.bookingService.getBookings();
    this.listLez$.subscribe((l) => {
      this.lezioni = [];
      l.forEach((item) => {
        if (item.lessonState === 0) {
          this.lezioni.push(item);
        }
      });
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
  }


  ionViewWillEnter() {
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
    this.agg = true;
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
