import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController, PickerController} from '@ionic/angular';
import {PickerOptions} from '@ionic/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from '../../model/subject.model';
import {SubjectService} from '../../services/subject.service';
import {PlanningService} from '../../services/planning.service';
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
    private loading;

    constructor(private pickerCtrl: PickerController,
                public formBuilder: FormBuilder,
                private subjectService: SubjectService,
                private planningService: PlanningService,
                private navController: NavController,
                private loadingController: LoadingController) {
    }

    ngOnInit() {
        this.ricercaFormModel = this.formBuilder.group({
            sottoMateria: ['', Validators.required],
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
                    console.log(this.subject);
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
        this.hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        this.ricercaFormModel.controls.fine.reset();
        console.log('cambio o setto orario lezione');
        const oraInizio = new Date(this.ricercaFormModel.controls.inizio.value);
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

    changeSelectElents() {
        console.log('cambio');
        this.ricercaFormModel.controls.sottoMateria.reset();
    }

    predi() {
        this.ricercaFormModel.controls.giorni.value.forEach((item) => {
            if (item === '1') {
                this.giorniSettimana[1] = 1;
            }
            if (item === '2') {
                this.giorniSettimana[2] = 1;
            }
            if (item === '3') {
                this.giorniSettimana[3] = 1;
            }
            if (item === '4') {
                this.giorniSettimana[4] = 1;
            }
            if (item === '5') {
                this.giorniSettimana[5] = 1;
            }
            if (item === '6') {
                this.giorniSettimana[6] = 1;
            }
            if (item === '7') {
                this.giorniSettimana[0] = 1;
            }
        });
        this.oraInizio = this.ricercaFormModel.controls.inizio.value;
        console.log('this.oraInizio');
        console.log(this.oraInizio);

        if (this.oraInizio !== undefined && this.oraInizio !== '' && this.oraInizio !== null) {
            this.oraInizio = this.oraInizio.substring(11, 16);
        } else {
            this.oraInizio = '';
        }
        this.oraFine = this.ricercaFormModel.controls.fine.value;
        console.log('this.oraFine');
        console.log(this.oraFine);
        if (this.oraFine !== undefined && this.oraFine !== '' && this.oraFine !== null) {
            this.oraFine = this.oraFine.substring(11, 16);
        } else {
            this.oraFine = '';
        }
        this.loadingPresent().then(() => {
            this.planningService.getRestPlannings(this.materia, this.ricercaFormModel.controls.nomeLezione.value,
                this.ricercaFormModel.controls.nomeCitta.value, this.ricercaFormModel.controls.sottoMateria.value,
                this.giorniSettimana[0], this.giorniSettimana[1], this.giorniSettimana[2],
                this.giorniSettimana[3], this.giorniSettimana[4], this.giorniSettimana[5],
                this.giorniSettimana[6], this.oraInizio, this.oraFine).subscribe(() => {
                this.disLoading();
                this.navController.navigateForward('risultati-ricerca');
            });
        });
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

    async showPicker() {
        const opts: PickerOptions = {
            buttons: [
                {
                    text: 'cancella',
                    role: 'cancell'
                },
                {
                    text: 'done'
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
}
