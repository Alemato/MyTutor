import {Component, OnInit} from '@angular/core';
import {Lezione} from '../../model/old/lezione.model';
import {Storage} from '@ionic/storage';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Utente} from '../../model/old/utente.model';
import {ModalController, NavController, PickerController} from '@ionic/angular';
import {InserimentoLezioniModalPage} from '../inserimento-lezioni-modal/inserimento-lezioni-modal.page';
import {PickerOptions} from '@ionic/core';
import {Subject} from '../../model/subject.model';
import {SubjectService} from '../../services/subject.service';
import {Planning} from '../../model/planning.model';
import {Lesson} from '../../model/lesson.model';
import {Teacher} from '../../model/teacher.model';
import {UserService} from '../../services/user.service';
import {PlanningService} from '../../services/planning.service';

@Component({
    selector: 'app-inserimento-lezioni',
    templateUrl: './inserimento-lezioni.page.html',
    styleUrls: ['./inserimento-lezioni.page.scss'],
})
export class InserimentoLezioniPage implements OnInit {
    private teacher$: BehaviorSubject<Teacher>;
    public materia = '';
    public materie = [];
    public sottoMaterie = [];
    private lezioneFormModel: FormGroup;
    public lezioni: Lezione[];
    // public planning: Planning;
    public plannings: Planning[] = [];
    public planningAppoggio = [];
    public planningVisualizzazione = [];
    private subjects: Subject[] = [];
    private ok = false;
    uscitaValue = null;
    // private lesson: Lesson;
    private subject: Subject;

    constructor(
        private pickerCtrl: PickerController,
        private storage: Storage,
        private userService: UserService,
        public formBuilder: FormBuilder,
        private subjectService: SubjectService,
        public modalController: ModalController,
        private planningService: PlanningService,
        private navController: NavController
    ) {
    }

    ngOnInit() {
        this.teacher$ = this.userService.getUser();
        this.subjectService.getRestList(false).subscribe((data: Subject[]) => {
            this.subjects = data;
            console.log(this.subjects);
            this.materie = [];
            let n = 0;
            this.materie.push();
            this.subjects.forEach((item) => {
                const obj1 = {text: item.macroSubject, value: n};
                n++;
                this.materie.push(obj1);
            });
            n++;
            this.materie.push({text: 'Creane una', value: n});
            this.sottoMaterie = [];
            let appogio = [];
            this.subjects.forEach((item) => {
                this.subjects.forEach((item1) => {
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
        this.lezioneFormModel = this.formBuilder.group({
            sottoMateria: ['', Validators.required],
            nuovaMateria: ['', Validators.required],
            nuovaSottoMateria: ['', Validators.required],
            nomeLezione: ['', Validators.required],
            prezzoOrario: ['', Validators.required],
            descrizione: ['', Validators.required],
        });
    }

    onChanges() {
        console.log('onChanges');
        console.log('this.materia');
        console.log(this.materia);
        if (this.materia === 'Creane una') {
            this.lezioneFormModel.get('sottoMateria').reset();
            this.lezioneFormModel.get('sottoMateria').disable();
            this.lezioneFormModel.get('nuovaMateria').enable();
            this.lezioneFormModel.get('nuovaSottoMateria').enable();


        } else if (this.materia !== 'Creane una') {
            this.lezioneFormModel.get('nuovaMateria').reset();
            this.lezioneFormModel.get('nuovaMateria').disable();
            this.lezioneFormModel.get('nuovaSottoMateria').reset();
            this.lezioneFormModel.get('nuovaSottoMateria').disable();
            this.lezioneFormModel.get('sottoMateria').enable();
            }
    }

    public findInvalidControls() {
        const invalid = [];
        const controls = this.lezioneFormModel.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        console.log('invalid');
        console.log(invalid);
    }

    inserisciLezione() {
        this.planningAppoggio.forEach((pianificazione) => {
            let subject;
            if (this.materia === 'Creane una') {
                subject = new Subject({idSubject: undefined, macroSubject: this.lezioneFormModel.controls.nuovaMateria.value,
                    microSubject: this.lezioneFormModel.controls.nuovaSottoMateria.value});
            } else {
                subject = new Subject({idSubject: undefined, macroSubject: this.materia,
                    microSubject: this.lezioneFormModel.controls.sottoMateria.value});
            }
            const lesson = new Lesson({idLesson: undefined, name: this.lezioneFormModel.controls.nomeLezione.value,
                price: this.lezioneFormModel.controls.prezzoOrario.value, description: this.lezioneFormModel.controls.descrizione.value,
                publicationDate: undefined}, subject, this.teacher$.value);
            const planning = new Planning({idPlanning: undefined, date: pianificazione.date, startTime: pianificazione.startTime,
                endTime: pianificazione.endTime}, lesson);
            this.plannings.push(planning);
        });
        console.log(this.plannings);
        this.planningService.createRestPlannings(this.plannings).subscribe((data) => {
            this.navController.navigateForward('lista-annunci-publicati');
        });
        }

    notificaCondizione() {
        this.apriModale();
    }

    async apriModale() {
        const modal = await this.modalController.create({
            component: InserimentoLezioniModalPage,
        });
        modal.onDidDismiss().then((dataReturned) => {
            console.log('i dati sono: ');
            console.log(dataReturned.data[0]);
            this.fillPlannings(dataReturned.data[0].dataOraIF);
            this.ok = dataReturned.data[1];
            console.log(this.ok);
        });
        await modal.present();
    }
    reverse(value: string): string {
        return value
            .split('')
            .reverse()
            .join('');
    }

    fillPlannings(datasReturned: any) {
        datasReturned.forEach((planning) => {
            const planningSingolo: any = {date: new Date(planning.dataLezione).getTime(),
                startTime: planning.oraInizio.slice(11, 16), endTime: planning.oraFine.slice(11, 16)};
            const data: string = planning.dataLezione.slice(8, 10) + '-' +
                planning.dataLezione.slice(5, 7) + '-' + planning.dataLezione.slice(0, 4);
            const planningPreVisual: any = {date: data,
                startTime: planning.oraInizio.slice(11, 16), endTime: planning.oraFine.slice(11, 16)};
            this.planningAppoggio.push(planningSingolo);
            this.planningVisualizzazione.push(planningPreVisual);
        });
        console.log('this.planningAppoggio');
        console.log(this.planningAppoggio);
        console.log('this.planningVisualizzazione');
        console.log(this.planningVisualizzazione);
    }

    rimuoviPlanning(index: number) {
        this.planningAppoggio.splice(index, 1);
        this.planningVisualizzazione.splice(index, 1);
        console.log('this.planningAppoggio');
        console.log(this.planningAppoggio);
        console.log('this.planningVisualizzazione');
        console.log(this.planningVisualizzazione);
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
        picker.onDidDismiss().then(async data => {
            const col = await picker.getColumn('nome');
            this.materia = col.options[col.selectedIndex].text;
            this.uscitaValue = col.options[col.selectedIndex].value;
            this.onChanges();
        });
        this.changeSelectElents();
    }

    changeSelectElents() {
        console.log('cambio');
        this.lezioneFormModel.controls.sottoMateria.reset();
    }
}
