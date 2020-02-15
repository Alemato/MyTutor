import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController, PickerController} from '@ionic/angular';
import {PickerOptions} from '@ionic/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from '../../model/subject.model';
import {SubjectService} from '../../services/subject.service';
import {PlanningService} from '../../services/planning.service';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-ricerca-lezioni',
    templateUrl: './ricerca-lezioni.page.html',
    styleUrls: ['./ricerca-lezioni.page.scss'],
})
export class RicercaLezioniPage implements OnInit {
    private listSubject$: BehaviorSubject<Subject[]>;
    materia = '';
    uscitaValue = null;
    minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    public materie = [];
    public sottoMaterie = [];
    public giorniSettimana: number[] = [0, 0, 0, 0, 0, 0, 0];
    private ricercaFormModel: FormGroup;
    private subject: Subject[] = [];
    public oraInizio = '';
    public oraFine = '';
    private cancelButton: string;
    private doneButton: string;
    private pleaseWaitMessage: string;
    private loading;

    constructor(private pickerCtrl: PickerController,
                public formBuilder: FormBuilder,
                private subjectService: SubjectService,
                private planningService: PlanningService,
                private navController: NavController,
                private loadingController: LoadingController,
                public translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.ricercaFormModel = this.formBuilder.group({
            sottoMateria: [''],
            nomeLezione: [''],
            nomeCitta: [''],
            inizio: [''],
            fine: [''],
            giorni: [['1', '2', '3', '4', '5', '6', '7']]
        });
        this.loadingPresent().then(() => {
            this.listSubject$ = this.subjectService.getListSubjet();
            this.subjectService.getRestList(false).subscribe(() => {
                this.listSubject$.subscribe((data: Subject[]) => {
                    this.subject = data;
                    this.materie = [];
                    let n = 0;
                    this.subject.forEach((item) => {
                        const obj1 = {text: item.macroSubject, value: n};
                        n++;
                        this.materie.push(obj1);
                    });
                    this.sottoMaterie = [];
                    let appogio = [];
                    this.subject.forEach((item) => {
                        this.subject.forEach((item1) => {
                            if (item.macroSubject === item1.macroSubject) {
                                const obj = {
                                    text: item1.microSubject,
                                    value: item1.microSubject
                                };
                                appogio.push(obj);
                            }
                        });
                        this.sottoMaterie.push(appogio);
                        appogio = [];
                    });
                });
                this.disLoading();
            });
        });
    }

    changeInizioLezione() {
        this.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        this.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        this.ricercaFormModel.controls.fine.reset();
        const oraInizio = new Date(this.ricercaFormModel.controls.inizio.value);
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

    changeSelectElents() {
        this.ricercaFormModel.controls.sottoMateria.reset();
    }

    resetto() {
        this.materia = '';
        this.giorniSettimana = [1, 1, 1, 1, 1, 1, 1];
        const obj = {
            sottoMateria: '',
            nomeLezione: '',
            nomeCitta: '',
            inizio: '',
            fine: '',
            giorni: ['1', '2', '3', '4', '5', '6', '7']
        };
        this.ricercaFormModel.setValue(obj);
    }

    predi() {
        this.ricercaFormModel.controls.giorni.value.forEach((item) => {
            if (item === '1') {
                this.giorniSettimana[0] = 1;
            }
            if (item === '2') {
                this.giorniSettimana[1] = 1;
            }
            if (item === '3') {
                this.giorniSettimana[2] = 1;
            }
            if (item === '4') {
                this.giorniSettimana[3] = 1;
            }
            if (item === '5') {
                this.giorniSettimana[4] = 1;
            }
            if (item === '6') {
                this.giorniSettimana[5] = 1;
            }
            if (item === '7') {
                this.giorniSettimana[6] = 1;
            }
        });
        this.oraInizio = this.ricercaFormModel.controls.inizio.value;

        if (this.oraInizio !== undefined && this.oraInizio !== '' && this.oraInizio !== null) {
            this.oraInizio = this.oraInizio.substring(11, 16);
        } else {
            this.oraInizio = '';
        }
        this.oraFine = this.ricercaFormModel.controls.fine.value;
        if (this.oraFine !== undefined && this.oraFine !== '' && this.oraFine !== null) {
            this.oraFine = this.oraFine.substring(11, 16);
        } else {
            this.oraFine = '';
        }
        this.loadingPresent().then(() => {
            /*this.planningService.getRestPlannings(this.materia, this.ricercaFormModel.controls.nomeLezione.value,
                this.ricercaFormModel.controls.nomeCitta.value, this.ricercaFormModel.controls.sottoMateria.value,
                this.giorniSettimana[0].toString(), this.giorniSettimana[1].toString(), this.giorniSettimana[2].toString(),
                this.giorniSettimana[3].toString(), this.giorniSettimana[4].toString(), this.giorniSettimana[5].toString(),
                this.giorniSettimana[6].toString(), this.oraInizio, this.oraFine).subscribe(() => {
                this.disLoading();
                this.navController.navigateForward('risultati-ricerca');
            });*/
        });
    }

    ionViewDidLeave() {
        this.ricercaFormModel.reset();
        this.materia = '';
        this.giorniSettimana = [1, 1, 1, 1, 1, 1, 1];
        const obj = {
            sottoMateria: '',
            nomeLezione: '',
            nomeCitta: '',
            inizio: '',
            fine: '',
            giorni: ['1', '2', '3', '4', '5', '6', '7']
        };
        this.ricercaFormModel.setValue(obj);
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

    async showPicker() {
        const opts: PickerOptions = {
            buttons: [
                {
                    text: this.cancelButton,
                    role: 'cancell'
                },
                {
                    text: this.doneButton
                }
            ],
            columns: [{
                name: 'nome',
                options: this.materie
            }]
        };
        const picker = await this.pickerCtrl.create(opts);
        await picker.present();
        picker.onDidDismiss().then(async () => {
            const col = await picker.getColumn('nome');
            this.materia = col.options[col.selectedIndex].text;
            this.uscitaValue = col.options[col.selectedIndex].value;
        });
        this.changeSelectElents();
    }

    private initTranslate() {
        this.translateService.get('CANCEL_BUTTON').subscribe((data) => {
            this.cancelButton = data;
        });
        this.translateService.get('DONE_BUTTON').subscribe((data) => {
            this.doneButton = data;
        });
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
    }
}
