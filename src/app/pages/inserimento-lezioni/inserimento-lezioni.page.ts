import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingController, ModalController, NavController, PickerController} from '@ionic/angular';
import {InserimentoLezioniModalPage} from '../inserimento-lezioni-modal/inserimento-lezioni-modal.page';
import {PickerOptions} from '@ionic/core';
import {Subject} from '../../model/subject.model';
import {SubjectService} from '../../services/subject.service';
import {Planning} from '../../model/planning.model';
import {Lesson} from '../../model/lesson.model';
import {Teacher} from '../../model/teacher.model';
import {UserService} from '../../services/user.service';
import {PlanningService} from '../../services/planning.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {LessonService} from '../../services/lesson.service';

@Component({
    selector: 'app-inserimento-lezioni',
    templateUrl: './inserimento-lezioni.page.html',
    styleUrls: ['./inserimento-lezioni.page.scss'],
})
export class InserimentoLezioniPage implements OnInit {
    private teacher$: BehaviorSubject<Teacher>;
    public listSubject$: BehaviorSubject<Subject[]>;
    private plannings$: BehaviorSubject<Planning[]>;
    public materia = '';
    public materie = [];
    public sottoMaterie = [];
    private lezioneFormModel: FormGroup;
    public plannings: Planning[] = [];
    public planningAppoggio = [];
    public planningVisualizzazione = [];
    private subjects: Subject[] = [];
    private ok = false;
    uscitaValue = null;
    private lesson: Lesson;
    private loading;
    public modifica = false;
    public booleanSottomateria = false;
    private cancelButton: string;
    private doneButton: string;
    private pleaseWaitMessage: string;
    private noPlanning = false;
    private giornoSettimana: string[] = [];
    private giorni = ['', '', '', '', '', '', ''];

    constructor(
        private pickerCtrl: PickerController,
        private storage: Storage,
        private userService: UserService,
        public formBuilder: FormBuilder,
        private subjectService: SubjectService,
        private lessonService: LessonService,
        public modalController: ModalController,
        private planningService: PlanningService,
        private navController: NavController,
        public loadingController: LoadingController,
        private activatedRoute: ActivatedRoute,
        public translateService: TranslateService
    ) {
    }

    ngOnInit() {
        this.initTranslate();
        this.materia = '';
        this.lezioneFormModel = this.formBuilder.group({
            sottoMateria: ['', Validators.required],
            nuovaMateria: ['', Validators.required],
            nuovaSottoMateria: ['', Validators.required],
            nomeLezione: ['', Validators.required],
            prezzoOrario: ['', Validators.required],
            descrizione: ['', Validators.required],
        });
        this.loadingPresent().then(() => {
            this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
                if (params.get('idLesson') !== 'null') {
                    this.modifica = true;
                    this.planningService.getRestPlanningByIdLesson(params.get('idLesson')).subscribe((pList) => {
                        if (pList[0] !== undefined) {
                            this.plannings$ = this.planningService.getPlannings();
                            this.plannings$.subscribe((p) => {
                                if (pList.length > 0) {
                                    this.planingCompat(p);
                                }
                                this.lesson = pList.find(x => x !== undefined).lesson;
                                this.materia = this.lesson.subject.macroSubject;
                                this.booleanSottomateria = true;
                                const obj = {
                                    sottoMateria: this.lesson.subject.microSubject,
                                    nuovaMateria: '',
                                    nuovaSottoMateria: '',
                                    nomeLezione: this.lesson.name,
                                    prezzoOrario: this.lesson.price.toString(),
                                    descrizione: this.lesson.description
                                };
                                this.lezioneFormModel.controls.sottoMateria.enable();
                                this.lezioneFormModel.setValue(obj);
                                this.onChanges();
                                this.disLoading();
                            });
                        } else {
                            this.lessonService.getRestLessons().subscribe((l) => {
                                this.lesson = l.find(x => x.idLesson === parseInt(params.get('idLesson'), 0));
                                this.lezioneFormModel.controls.sottoMateria.enable();
                                this.booleanSottomateria = true;
                                this.materia = this.lesson.subject.macroSubject;
                                const obj = {
                                    sottoMateria: this.lesson.subject.microSubject,
                                    nuovaMateria: '',
                                    nuovaSottoMateria: '',
                                    nomeLezione: this.lesson.name,
                                    prezzoOrario: this.lesson.price.toString(),
                                    descrizione: this.lesson.description
                                };
                                this.lezioneFormModel.setValue(obj);
                                this.onChanges();
                                this.disLoading();
                            });
                            this.noPlanning = true;
                        }
                    });
                }
            });
            this.teacher$ = this.userService.getUser();
            this.listSubject$ = this.subjectService.getListSubjet();
            this.subjectService.getRestList(false).subscribe(() => {
                this.listSubject$.subscribe((data: Subject[]) => {
                    this.subjects = data;
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
                    if (!this.modifica) {
                        this.disLoading();
                    }
                });
            });
        });
    }

    planingCompat(p: Planning[]) {
        for (let i = p.length - 1; i >= 0; i--) {
            let flag = false;
            for (let j = i - 1; j >= 0; j--) {
                if (new Date(p[i].date).getDay() === new Date(p[j].date).getDay() &&
                    p[i].startTime.slice(0, 4) === p[j].startTime.slice(0, 4) &&
                    p[i].endTime.slice(0, 4) === p[j].endTime.slice(0, 4)) {
                    flag = false;
                    break;
                } else {
                    flag = true;
                }
            }
            if (flag) {
                this.giornoSettimana.push(this.giorni[new Date(p[i].date).getDay()]);
                const planningPerCaricareI: Planning = p[i];
                this.planningAppoggio.push(planningPerCaricareI);
                const planningPerVisualizzareI: Planning = p[i];
                planningPerVisualizzareI.startTime = planningPerVisualizzareI.startTime.slice(0, 5);
                planningPerVisualizzareI.endTime = planningPerVisualizzareI.endTime.slice(0, 5);
                this.planningVisualizzazione.push(planningPerVisualizzareI);
            }
        }
        const planningPerCaricareZero: Planning = p[0];
        this.giornoSettimana.push(this.giorni[new Date(p[0].date).getDay()]);
        this.planningAppoggio.push(planningPerCaricareZero);
        this.planningAppoggio.reverse();
        const planningPerVisualizzareZero: Planning = p[0];
        planningPerVisualizzareZero.startTime = planningPerVisualizzareZero.startTime.slice(0, 5);
        planningPerVisualizzareZero.endTime = planningPerVisualizzareZero.endTime.slice(0, 5);
        this.planningVisualizzazione.push(planningPerVisualizzareZero);
        this.planningVisualizzazione.reverse();
        this.giornoSettimana.reverse();
    }

    onChanges() {
        if (this.materia === 'Creane una' || this.materia === 'Create One') {
            this.lezioneFormModel.controls.sottoMateria.reset();
            this.lezioneFormModel.controls.sottoMateria.disable();
            this.lezioneFormModel.get('nuovaMateria').enable();
            this.lezioneFormModel.get('nuovaSottoMateria').enable();


        } else if (this.materia !== 'Creane una' && this.materia !== 'Create One') {
            this.lezioneFormModel.get('nuovaMateria').reset();
            this.lezioneFormModel.get('nuovaMateria').disable();
            this.lezioneFormModel.get('nuovaSottoMateria').reset();
            this.lezioneFormModel.get('nuovaSottoMateria').disable();
            this.lezioneFormModel.controls.sottoMateria.enable();
        }
    }

    inserisciLezione() {
        /*
        this.planningAppoggio.forEach((pianificazione) => {
            let subject;
            if (this.materia === 'Creane una' || this.materia === 'Create One') {
                subject = new Subject({
                    idSubject: undefined, macroSubject: this.lezioneFormModel.controls.nuovaMateria.value,
                    microSubject: this.lezioneFormModel.controls.nuovaSottoMateria.value
                });
            } else {
                subject = new Subject({
                    idSubject: undefined, macroSubject: this.materia,
                    microSubject: this.lezioneFormModel.controls.sottoMateria.value
                });
            }
            const lesson = new Lesson({
                idLesson: undefined, name: this.lezioneFormModel.controls.nomeLezione.value,
                price: this.lezioneFormModel.controls.prezzoOrario.value, description: this.lezioneFormModel.controls.descrizione.value,
                publicationDate: undefined
            }, subject, this.teacher$.value);
            const planning = new Planning({
                idPlanning: undefined, date: pianificazione.date, startTime: pianificazione.startTime,
                endTime: pianificazione.endTime, available: true
            }, lesson);
            this.plannings.push(planning);
        });
        console.log(this.plannings);
        this.loadingPresent().then(() => {
            this.planningService.createRestPlannings(this.plannings).subscribe(() => {
                this.lessonService.getRestLessons().subscribe((le: Lesson[]) => {
                    let idL = -1;
                    le.forEach((l) => {
                        if (l.name === this.lezioneFormModel.controls.nomeLezione.value &&
                            l.description === this.lezioneFormModel.controls.descrizione.value) {
                            idL = l.idLesson;
                        }
                    });
                    this.disLoading();
                    if (idL < 0) {
                        this.navController.navigateRoot('lista-annunci-publicati');
                    }
                    const url: string = '/lezione/lesson/' + idL.toString();
                    this.navController.navigateRoot(url);
                });
            });
        });
*/
    }

    modificaLezione() {
/*        if (this.planningAppoggio.length > 0) {
            this.planningAppoggio.forEach((pianificazione1) => {
                let subject;
                if (this.materia === 'Creane una' || this.materia === 'Create One') {
                    subject = new Subject({
                        idSubject: undefined, macroSubject: this.lezioneFormModel.controls.nuovaMateria.value,
                        microSubject: this.lezioneFormModel.controls.nuovaSottoMateria.value
                    });
                } else {
                    subject = new Subject({
                        idSubject: undefined, macroSubject: this.materia,
                        microSubject: this.lezioneFormModel.controls.sottoMateria.value
                    });
                }
                const lesson = new Lesson({
                    idLesson: this.lesson.idLesson, name: this.lezioneFormModel.controls.nomeLezione.value,
                    price: this.lezioneFormModel.controls.prezzoOrario.value, description: this.lezioneFormModel.controls.descrizione.value,
                    publicationDate: this.lesson.publicationDate
                }, subject, this.teacher$.value);
                let star = pianificazione1.startTime;
                if (pianificazione1.startTime.length < 6) {
                    star = pianificazione1.startTime + ':00';
                }
                let en = pianificazione1.endTime;
                if (pianificazione1.endTime.length < 6) {
                    en = pianificazione1.endTime + ':00';
                }

                const planning = new Planning({
                    idPlanning: undefined, date: pianificazione1.date, startTime: star,
                    endTime: en, available: true
                }, lesson);
                this.plannings.push(planning);
            });
            console.log('modifica dei planning');
            console.log(this.plannings);

            this.loadingPresent().then(() => {
                this.planningService.modifyRestPlannings(this.plannings, this.lesson.idLesson).subscribe(() => {
                    this.disLoading();
                    this.navController.navigateRoot('lista-annunci-publicati');
                });
            });
        } else {
            this.loadingPresent().then(() => {
                this.lessonService.modifyRestLesson(this.lesson).subscribe(() => {
                    this.disLoading();
                    const url: string = '/lezione/lesson/' + this.lesson.idLesson.toString();
                    this.navController.navigateRoot(url);
                });
            });
        }*/
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

    notificaCondizione() {
        this.apriModale();
    }

    async apriModale() {
        if (this.modifica) {
            const modal = await this.modalController.create({
                component: InserimentoLezioniModalPage,
                componentProps: {
                    modifica: this.modifica,
                    idLesson: this.lesson.idLesson
                }
            });
            modal.onDidDismiss().then((dataReturned) => {
                console.log('i dati sono: ');
                console.log(dataReturned.data[0]);
                this.planningVisualizzazione = [];
                this.planningAppoggio = [];
                this.giornoSettimana = [];
                this.fillPlannings(dataReturned.data[0].dataOraIF);
                this.ok = dataReturned.data[1];
                console.log(this.ok);
            });
            await modal.present();
        } else {
            const modal = await this.modalController.create({
                component: InserimentoLezioniModalPage
            });
            modal.onDidDismiss().then((dataReturned) => {
                console.log('i dati sono: ');
                console.log(dataReturned.data[0]);
                this.planningVisualizzazione = [];
                this.planningAppoggio = [];
                this.giornoSettimana = [];
                this.fillPlannings(dataReturned.data[0].dataOraIF);
                this.ok = dataReturned.data[1];
                console.log(this.ok);
            });
            await modal.present();
        }
    }

    fillPlannings(datasReturned: any) {
        datasReturned.forEach((planning) => {
            const inizioAppo = new Date(new Date(planning.oraInizio).getTime() + (1000 * 60 * 60)).toISOString();
            const fineAppo = new Date(new Date(planning.oraFine).getTime() + (1000 * 60 * 60)).toISOString();

            const planningSingolo: any = {
                date: new Date(planning.dataLezione).getTime() + (1000 * 60 * 60),
                startTime: inizioAppo.slice(11, 16) + ':00', endTime: fineAppo.slice(11, 16) + ':00'
            };
            const data = new Date(new Date(planning.dataLezione).getTime() + (1000 * 60 * 60)).getTime();
            const planningPreVisual: any = {
                date: data,
                startTime: inizioAppo.slice(11, 16), endTime: fineAppo.slice(11, 16)
            };
            this.planningAppoggio.push(planningSingolo);
            this.giornoSettimana.push(this.giorni[new Date(data).getDay()]);
            this.planningVisualizzazione.push(planningPreVisual);
        });
    }

    rimuoviPlanning(index: number) {
        this.planningAppoggio.splice(index, 1);
        this.planningVisualizzazione.splice(index, 1);
        this.giornoSettimana = [];
        this.planningAppoggio.forEach((pA) => {
            this.giornoSettimana.push(this.giorni[new Date(pA.date).getDay()]);
        });
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
            this.onChanges();
        });
        this.changeSelectElents();
    }

    changeSelectElents() {
        this.lezioneFormModel.controls.sottoMateria.reset();
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
        this.translateService.get('CREATE_ONE').subscribe((data) => {
            this.materia = data;
        });
        this.translateService.get('CREATE_ONE').subscribe((data) => {
            this.materia = data;
        });
        this.translateService.get('SUNDAY').subscribe((data) => {
            this.giorni[0] = data;
        });
        this.translateService.get('MONDAY').subscribe((data) => {
            this.giorni[1] = data;
        });
        this.translateService.get('TUESDAY').subscribe((data) => {
            this.giorni[2] = data;
        });
        this.translateService.get('WEDNESDAY').subscribe((data) => {
            this.giorni[3] = data;
        });
        this.translateService.get('THURSDAY').subscribe((data) => {
            this.giorni[4] = data;
        });
        this.translateService.get('FRIDAY').subscribe((data) => {
            this.giorni[5] = data;
        });
        this.translateService.get('SATURDAY').subscribe((data) => {
            this.giorni[6] = data;
        });
    }
}
