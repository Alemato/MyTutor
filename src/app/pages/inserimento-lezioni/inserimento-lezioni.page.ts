import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, NavController} from '@ionic/angular';
import {Subject} from '../../model/subject.model';
import {SubjectService} from '../../services/subject.service';
import {Lesson} from '../../model/lesson.model';
import {UserService} from '../../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LessonService} from '../../services/lesson.service';

@Component({
    selector: 'app-inserimento-lezioni',
    templateUrl: './inserimento-lezioni.page.html',
    styleUrls: ['./inserimento-lezioni.page.scss'],
})
export class InserimentoLezioniPage implements OnInit {
    private teacher$: BehaviorSubject<any>;
    private listSubject$: BehaviorSubject<Subject[]>;
    private materia = '';
    private sottoMateria = '';
    private materie = [];
    private sottoMaterie = [];
    private lezioneFormModel: FormGroup;
    private inserisciDaListaAnnunci = false;
    private lesson: Lesson = new Lesson();
    private modifica = false;

    private cancelButton: string;
    private doneButton: string;
    private pleaseWaitMessage: string;
    private lessonCreated: string;
    private messagePlansAdd: string;
    private yesButton: string;
    private insertNewSubject: string;
    private subject: string;
    private insertNewSubSubject: string;
    private subSubject;

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private subjectService: SubjectService,
        private lessonService: LessonService,
        private translateService: TranslateService,
        private route: ActivatedRoute,
        private alertController: AlertController,
        private router: Router,
        private navController: NavController) {
    }

    ngOnInit() {
        this.initTranslate();
        this.teacher$ = this.userService.getUser();
        this.route.data.subscribe((data) => {
            this.inserisciDaListaAnnunci = data.listaAnnunci;
            if (!data.isInsert) {
                this.lesson = data.lesson;
                this.modifica = true;
                this.lezioneFormModel = this.formBuilder.group({
                    name: [this.lesson.name, Validators.required],
                    description: [this.lesson.description, Validators.required]
                });
            } else {
                this.lezioneFormModel = this.formBuilder.group({
                    macroSubject: ['', Validators.required],
                    microSubject: ['', Validators.required],
                    name: ['', Validators.required],
                    price: ['', Validators.required],
                    description: ['', Validators.required]
                });
                this.lezioneFormModel.controls.microSubject.disable();
            }
            this.listSubject$ = this.subjectService.getListSubjet();
            this.subjectService.getRestList(false).subscribe(() => {
                this.listSubject$.subscribe((subjects: Subject[]) => {
                    this.materie = [];
                    subjects.forEach((item) => {
                        const indiceMateria = this.materie.findIndex(m => m === item.macroSubject);
                        if (indiceMateria === -1) {
                            this.materie.push(item.macroSubject);
                        }
                    });
                    this.materie.push('Creane una');
                    let appogio = [];
                    this.sottoMaterie = [];
                    this.materie.forEach((item1) => {
                        subjects.forEach((item2) => {
                            if (item1 === item2.macroSubject) {
                                appogio.push(item2.microSubject);
                            }
                        });
                        appogio.push('Creane una');
                        this.sottoMaterie.push(appogio);
                        appogio = [];
                    });
                });
            });
        });
    }

    ionViewWillEnter() {
        this.materia = '';
    }

    inserisciLezione() {
        this.teacher$.subscribe((teacher) => {
            console.log(teacher);
            console.log(this.lezioneFormModel.value);
            this.lesson.name = this.lezioneFormModel.value.name;
            this.lesson.price = this.lezioneFormModel.value.price;
            this.lesson.description = this.lezioneFormModel.value.description;
            this.lesson.teacher = teacher;
            const subject: Subject = new Subject();
            subject.macroSubject = this.materia;
            subject.microSubject = this.sottoMateria;
            this.lesson.subject = subject;
            this.lessonService.createRestLesson(this.lesson).subscribe((urlLezione) => {
                console.log('urlLezione');
                console.log(urlLezione);
                this.presentaAlert(urlLezione);
            });
        });
    }

    async presentaAlert(urlLezione: string) {
        const alert = await this.alertController.create({
            header: this.lessonCreated,
            message: this.messagePlansAdd,
            buttons: [
                {
                    text: this.cancelButton,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.navController.navigateRoot('lista-annunci-publicati');
                    }
                }, {
                    text: this.yesButton,
                    handler: () => {
                        const root = this.router.config.find(r => r.path === 'lista-pianificazioni');
                        root.data = {isInsert: true, noPlanning: false, urlLezione, idLezione: 0};
                        this.navController.navigateRoot('lista-pianificazioni');
                    }
                }]
        });

        await alert.present();
    }

    modificaLezione() {
        this.lesson.name = this.lezioneFormModel.value.name;
        this.lesson.description = this.lezioneFormModel.value.description;
        this.lessonService.modifyRestLesson(this.lesson).subscribe(() => {
            this.navController.navigateRoot('lista-annunci-publicati');
        });
    }

    cambioMateria(valoreSelezionato) {
        if (valoreSelezionato === 'Creane una' ||
            valoreSelezionato === 'Create one') {
            this.inputNuovaMateria();
        } else if (valoreSelezionato !== '') {
            this.materia = valoreSelezionato;
            this.lezioneFormModel.controls.microSubject.reset();
            this.lezioneFormModel.controls.microSubject.enable();
        }
    }

    annulla() {
        console.log(this.findInvalidControls());
        this.navController.back();
    }

    public findInvalidControls() {
        const invalid = [];
        const controls = this.lezioneFormModel.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid;
    }

    async inputNuovaMateria() {
        const alert = await this.alertController.create({
            header: this.insertNewSubject,
            inputs: [{type: 'text', placeholder: this.subject}],
            buttons: [{
                text: this.cancelButton,
                handler: () => {
                    alert.dismiss(false);
                    this.materia = '';
                    this.lezioneFormModel.controls.microSubject.disable();
                    this.lezioneFormModel.controls.microSubject.reset();
                    this.lezioneFormModel.controls.macroSubject.reset();
                }
            }, {text: 'Ok'}]
        });
        alert.onDidDismiss().then((data) => {
            if (data.data) {
                const customMateria: string = data.data.values[0];
                if (customMateria !== '' && customMateria !== ' ' && customMateria !== undefined) {
                    const indiceMateria = this.materie.findIndex(m => m === customMateria);
                    if (indiceMateria === -1) {
                        this.materie.pop();
                        this.materie.push(customMateria);
                        this.materie.push('Creane una');
                        this.materia = customMateria;
                        this.sottoMaterie.push(['Creane una']);
                    } else {
                        this.materia = this.materie[indiceMateria];
                    }
                } else {
                    this.materia = '';
                    this.lezioneFormModel.controls.macroSubject.reset();
                }
            }
        });
        await alert.present();
    }

    async cambioSottoMateria(valoreSelezionatoSottomateria) {
        if (valoreSelezionatoSottomateria === 'Creane una' ||
            valoreSelezionatoSottomateria === 'Create one') {
            await this.inputNuovaSottoMateria();
        } else {
            this.sottoMateria = valoreSelezionatoSottomateria;
        }
    }

    async inputNuovaSottoMateria() {
        const alert = await this.alertController.create({
            header: this.insertNewSubSubject,
            inputs: [{type: 'text', placeholder: this.subSubject}],
            buttons: [{
                text: 'Cancel',
                handler: () => {
                    alert.dismiss(false);
                    this.sottoMateria = '';
                    this.lezioneFormModel.controls.microSubject.reset();
                }
            }, {text: 'Ok'}]
        });
        alert.onDidDismiss().then((data) => {
            if (data.data) {
                const customSottoMateria: string = data.data.values[0];
                if (customSottoMateria !== '' && customSottoMateria !== ' ' && customSottoMateria !== undefined) {
                    const indiceMateria = this.sottoMaterie[this.materie.indexOf(this.materia)].findIndex(m => m === customSottoMateria);
                    if (indiceMateria === -1) {
                        this.sottoMaterie[this.materie.indexOf(this.materia)].pop();
                        this.sottoMaterie[this.materie.indexOf(this.materia)].push(customSottoMateria);
                        this.sottoMaterie[this.materie.indexOf(this.materia)].push('Creane una');
                        this.sottoMateria = customSottoMateria;
                    } else {
                        this.sottoMateria = this.sottoMaterie[indiceMateria];
                    }
                } else {
                    this.sottoMateria = '';
                    this.lezioneFormModel.controls.microSubject.reset();
                }
            }
        });
        await alert.present();
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
        //
        this.translateService.get('LESSON_CREATED').subscribe((data) => {
            this.lessonCreated = data;
        });
        this.translateService.get('MESSAGE_PLANS_ADD').subscribe((data) => {
            this.messagePlansAdd = data;
        });
        this.translateService.get('YES').subscribe((data) => {
            this.yesButton = data;
        });
        this.translateService.get('INSERT_NEW_SUBJECT').subscribe((data) => {
            this.insertNewSubject = data;
        });
        this.translateService.get('SUBJECT').subscribe((data) => {
            this.subject = data;
        });
        this.translateService.get('INSERT_NEW_SUB_SUBJECT').subscribe((data) => {
            this.insertNewSubSubject = data;
        });
        this.translateService.get('SUB_SUBJECT').subscribe((data) => {
            this.subSubject = data;
        });
    }
}
