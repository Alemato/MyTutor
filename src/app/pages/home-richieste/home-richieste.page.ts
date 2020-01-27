import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {AlertController, LoadingController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {BookingService, Lez} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';
import { TranslateService } from '@ngx-translate/core';

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
  private confirmLessonHeader: string;
  private confirmSubHeader: string;
  private confirmLessonMessage: string;
  private cancelButton: string;
  private declineLessonHeader: string;
  private declineLessonMessage: string;
  private cancelLessonHeader: string;
  private cancelLessonMessage: string;
  private pleaseWaitMessage: string;

  constructor(public alertController: AlertController,
              private userService: UserService,
              private bookingService: BookingService,
              public loadingController: LoadingController,
              public translateService: TranslateService) {
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
    this.initTranslate();
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

  async presentAlertRifiutaLezione(idbook) {
    const alert = await this.alertController.create({
      header: this.declineLessonHeader,
      subHeader: this.confirmSubHeader ,
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
      message: this.pleaseWaitMessage,
      translucent: true
    });
    return await this.loading.present();
  }

  async disLoading() {
    await this.loading.dismiss();
  }

  private initTranslate() {
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
