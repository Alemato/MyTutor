import {Component, Input, OnInit} from '@angular/core';
import {Planning} from '../../model/planning.model';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {Booking} from '../../model/booking.model';
import {BookingService} from '../../services/booking.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-creazione-prenotazione-modal',
    templateUrl: './creazione-prenotazione-modal.page.html',
    styleUrls: ['./creazione-prenotazione-modal.page.scss'],
})
export class CreazionePrenotazioneModalPage implements OnInit {
    private bookingFormModel: FormGroup;
    private listPlanningGiusti: Planning[];
    private bookingIsCreate = false;
    private user$: BehaviorSubject<Student | Teacher>;
    startHourValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23];
    endHourValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23];

    @Input() listPlanning: Planning[];
    @Input() itemP: Planning;
    @Input() listIdexP: number[];

    private setLanguage = 'it-IT';
    private bookingMade: string;
    private bookMoreDays: string;
    private yes: string;

    constructor(private modalController: ModalController,
                private formBuilder: FormBuilder,
                private userService: UserService,
                private bookingService: BookingService,
                private alertController: AlertController,
                private navController: NavController,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.user$ = this.userService.getUser();
        this.setStartHourValue();
        this.setEndHourValue();
        this.setListPlanning();
        this.bookingFormModel = this.formBuilder.group({
            startTime: ['', Validators.compose([
                Validators.required
            ])],
            endTime: ['', Validators.compose([
                Validators.required]
            )]
        });
        this.bookingFormModel.controls.endTime.disable();
    }

    setListPlanning() {
      this.listPlanningGiusti = [];
      for (let i = 0 ; i <= this.listIdexP.length - 1; i++) {
        this.listPlanningGiusti.push(this.listPlanning.find(p => p.idPlanning === this.listIdexP[i]));
      }
      console.log(this.listPlanning);
      console.log(this.listIdexP);
      console.log(this.itemP);
    }

    async onSubmit() {
        const startTime = new Date(this.bookingFormModel.controls.startTime.value).getHours();
        const endTime = new Date(this.bookingFormModel.controls.endTime.value).getHours();
        const numberOfBooking = endTime - startTime;
        let start = startTime;
        console.log(this.listPlanningGiusti);
        for (let i = 0; i < numberOfBooking; i++) {
            const booking = new Booking();
            booking.date = new Date().getTime();
            booking.lessonState = 0;
            booking.student = this.user$.getValue() as Student;
            booking.planning = this.listPlanningGiusti.find(p => p.startTime.slice(0, 2) === start.toString());
            start = start + 1;
            this.bookingIsCreate = true;
            this.bookingService.createRestBooking(booking).subscribe(() => {});
        }
        if (this.bookingIsCreate) {
          await this.presentAlertConfirm();
        }
    }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.bookingMade,
      message: this.bookMoreDays,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.closeModal().then(() => {
              this.navController.navigateRoot('/tabs/richieste');
            });
          }
        }, {
          text: this.yes,
          handler: () => {
           this.closeModal();
          }
        }
      ]
    });

    await alert.present();
  }

    changeStartHour() {
        if (this.bookingFormModel.controls.endTime.disabled) {
            this.bookingFormModel.controls.endTime.enable();
        }
        this.bookingFormModel.controls.endTime.reset();
        this.setEndHourValue();
        const startTime = new Date(this.bookingFormModel.controls.startTime.value).getHours();
        const endHourIndex = this.endHourValue.findIndex(n => n === startTime);
        this.endHourValue.splice(0, endHourIndex + 1);
    }

    setStartHourValue() {
        const appoggio = [];
        for (let o = parseInt(this.itemP.startTime.slice(0, 2), 0); o < parseInt(this.itemP.endTime.slice(0, 2), 0); o++) {
            appoggio.push(o);
        }
        this.startHourValue = appoggio;
    }

    setEndHourValue() {
        const appoggio = [];
        for (let o = parseInt(this.itemP.startTime.slice(0, 2), 0); o <= parseInt(this.itemP.endTime.slice(0, 2), 0); o++) {
            appoggio.push(o);
        }
        this.endHourValue = appoggio;
    }

    async closeModal() {
        await this.modalController.dismiss({isCreate: this.bookingIsCreate});
    }

    private initTranslate() {
        this.translateService.get('SET_LANGUAGE').subscribe((data) => {
            this.setLanguage = data;
        });
        this.translateService.get('BOOKING_MADE').subscribe((data) => {
            this.bookingMade = data;
        });
        this.translateService.get('BOOK_MORE_DAYS').subscribe((data) => {
            this.bookMoreDays = data;
        });
        this.translateService.get('YES').subscribe((data) => {
            this.yes = data;
        });
    }

}
