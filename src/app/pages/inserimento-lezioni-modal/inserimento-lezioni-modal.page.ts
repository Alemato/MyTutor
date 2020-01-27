import {Component, Input, OnInit} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
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

    // returns all form groups under contacts
    // prende l'oggetto
    get dataOraIFFormGroup() {
        return this.dataLezioneFormModel.get('dataOraIF') as FormArray;
    }

    constructor(
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
                    this.plannings = planningList;
                    console.log('this.plannings');
                    console.log(this.plannings);
                    this.planingCompat();
                    this.aggiungiPlanning();
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
            console.log('i');
            console.log(i);
            let flag = false;
            for (let j = i - 1; j >= 0; j--) {
                console.log('j');
                console.log(j);
                console.log('this.plannings[i]');
                console.log(this.plannings[i]);
                console.log('this.plannings[j]');
                console.log(this.plannings[j]);
                if (new Date(this.plannings[i].date).getDay() === new Date(this.plannings[j].date).getDay() &&
                    this.plannings[i].startTime === this.plannings[j].startTime &&
                    this.plannings[i].endTime === this.plannings[j].endTime) {
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
        console.log('this.planningsCompattati');
        console.log(this.planningsCompattati);
    }

    changeInizioLezione(index) {
        this.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        this.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        console.log(((this.dataLezioneFormModel.get('dataOraIF') as FormArray).controls[index] as FormGroup).controls.oraFine.reset());
        console.log('cambio o setto orario lezione');
        // tslint:disable-next-line:max-line-length
        const oraInizio = new Date(((this.dataLezioneFormModel.get('dataOraIF') as FormArray).controls[index] as FormGroup).controls.oraInizio.value);
        console.log(oraInizio);
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
            console.log('obj');
            console.log(obj);
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
        this.arrayDymension = (this.dataLezioneFormModel.get('dataOraIF') as FormArray).length ;
    }

    async chiudiModale() {
        await this.modalController.dismiss([this.dataLezioneFormModel.value, true]);
    }

    // method triggered when form is submitted
    submit() {
        console.log(this.dataLezioneFormModel.value);
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
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
    }
}
