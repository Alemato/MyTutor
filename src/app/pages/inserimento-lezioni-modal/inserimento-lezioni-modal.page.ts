import {Component, Input, OnInit} from '@angular/core';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {PlanningService} from '../../services/planning.service';
import {Planning} from '../../model/planning.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-inserimento-lezioni-modal',
    templateUrl: './inserimento-lezioni-modal.page.html',
    styleUrls: ['./inserimento-lezioni-modal.page.scss'],
})

export class InserimentoLezioniModalPage implements OnInit {
    @Input() modifica: boolean;
    @Input() idLesson: number;
    public dataLezioneFormModel: FormGroup;
    public listaDataOraIF: FormArray;
    public arrayDymension = 1;
    private loading;
    public plannings: Planning[] = [];
    public planningsCompattati: Planning[] = [];
    minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    private pleaseWaitMessage: string;
    private lessonPlanHeader: string;
    private lessonPlanSubHeader: string;
    private lessonPlanMessage: string;
    private cancelButton: string;
    private doneButton: string;

    // returns all form groups under contacts
    // prende l'oggetto
    get dataOraIFFormGroup() {
        return this.dataLezioneFormModel.get('dataOraIF') as FormArray;
    }

    constructor(
        public alertController: AlertController,
        public formBuilder: FormBuilder,
        public modalController: ModalController,
        private planningService: PlanningService,
        public loadingController: LoadingController,
        private translateService: TranslateService
    ) {
    }

    ngOnInit() {
        this.initTranslate();
        console.log('this.modifica');
        console.log(this.modifica);
        console.log('this.idLesson');
        console.log(this.idLesson);
        if (this.modifica) {
            this.dataLezioneFormModel = this.formBuilder.group({
                dataOraIF: this.formBuilder.array([this.creaDataOraIF()])
            });
            this.loadingPresent().then(() => {
                this.listaDataOraIF = this.dataLezioneFormModel.get('dataOraIF') as FormArray;
                this.planningService.getRestPlanningByIdLesson(this.idLesson.toString()).subscribe((planningList) => {
                    if (planningList.length > 0) {
                        this.plannings = planningList;
                        this.planingCompat();
                        this.aggiungiPlanning();
                        this.disLoading();
                    }
                    this.disLoading();
                });
            });
        } else {
            this.dataLezioneFormModel = this.formBuilder.group({
                dataOraIF: this.formBuilder.array([this.creaDataOraIF()])
            });
            this.listaDataOraIF = this.dataLezioneFormModel.get('dataOraIF') as FormArray;
        }
    }

    planingCompat() {
        for (let i = this.plannings.length - 1; i >= 0; i--) {
            let flag = false;
            for (let j = i - 1; j >= 0; j--) {
                if (new Date(this.plannings[i].date).getDay() === new Date(this.plannings[j].date).getDay() &&
                    this.plannings[i].startTime.slice(0, 4) === this.plannings[j].startTime.slice(0, 4) &&
                    this.plannings[i].endTime.slice(0, 4) === this.plannings[j].endTime.slice(0, 4)) {
                    flag = false;
                    break;
                } else {
                    flag = true;
                }
            }
            if (flag) {
                this.planningsCompattati.push(this.plannings[i]);
            }
        }
        this.planningsCompattati.push(this.plannings[0]);
        this.planningsCompattati.reverse();
    }

    changeInizioLezione(index) {
        this.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        this.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        // tslint:disable-next-line:max-line-length
        const oraInizio = new Date(((this.dataLezioneFormModel.get('dataOraIF') as FormArray).controls[index] as FormGroup).controls.oraInizio.value);
        let i;
        let e = 0;
        for (i = 0; i < this.hours.length; i++) {
            if (this.hours[i] < oraInizio.getHours()) {
                e++;
            }
        }
        this.hours = this.hours.slice(e + 1, this.hours.length);
        e = 0;
        for (i = 0; i < this.minutes.length; i++) {
            if (this.minutes[i] < oraInizio.getMinutes()) {
                e++;
            }
        }
        this.minutes = this.minutes.slice(e, this.minutes.length);
    }

    aggiungiPlanning() {
        let count = 0;
        this.planningsCompattati.forEach((piani: Planning, index) => {
            if (count > 0) {
                this.listaDataOraIF.push(this.creaDataOraIF());
            }
            count++;
            const obj = {
                // 1968-11-16T00:00:00'
                dataLezione: new Date(piani.date).toISOString(),
                oraInizio: new Date('2020-01-25T' + piani.startTime).toISOString(),
                oraFine: new Date('2020-01-25T' + piani.endTime).toISOString()
            };
            this.listaDataOraIF.controls[index].setValue(obj);
            this.arrayDymension = (this.dataLezioneFormModel.get('dataOraIF') as FormArray).length;
        });
    }


    // contact formgroup
    creaDataOraIF(): FormGroup {
        return this.formBuilder.group({
            dataLezione: ['', Validators.required],
            oraInizio: ['', Validators.required],
            oraFine: ['', Validators.required],
        });
    }

    // add a contact form group
    aggiungiCampo() {
        this.listaDataOraIF.push(this.creaDataOraIF());
        this.arrayDymension = (this.dataLezioneFormModel.get('dataOraIF') as FormArray).length;
    }

    // remove contact from group
    rimuoviCampo(index) {
        if ((this.dataLezioneFormModel.get('dataOraIF') as FormArray).length > 1) {
            this.listaDataOraIF.removeAt(index);
        }
        this.arrayDymension = (this.dataLezioneFormModel.get('dataOraIF') as FormArray).length;
    }

    async chiudiModale() {
        await this.modalController.dismiss([this.dataLezioneFormModel.value, true]);
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
    async presentAlertPlan() {
        const alert = await this.alertController.create({
            header: this.lessonPlanHeader,
            message: this.lessonPlanMessage,
            buttons: [
                {
                    text: this.cancelButton,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    }
                }, {
                    text: this.doneButton,
                    handler: () => {
                        this.chiudiModale();
                    }
                }]
        });

        await alert.present();
    }

    private initTranslate() {
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
        this.translateService.get('CANCEL_BUTTON').subscribe((data) => {
            this.cancelButton = data;
        });
        this.translateService.get('DONE_BUTTON').subscribe((data) => {
            this.doneButton = data;
        });
        this.translateService.get('LESSON_PLAN_HEADER').subscribe((data) => {
            this.lessonPlanHeader = data;
        });
        this.translateService.get('LESSON_PLAN_MESSAGE').subscribe((data) => {
            this.lessonPlanMessage = data;
        });
    }
}
