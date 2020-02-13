import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, ModalController, NavController, PickerController} from '@ionic/angular';
import {Subject} from '../../model/subject.model';
import {SubjectService} from '../../services/subject.service';
import {Lesson} from '../../model/lesson.model';
import {UserService} from '../../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {LessonService} from '../../services/lesson.service';
import {PlanningService} from '../../services/planning.service';

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
    private okModal = false;
    private lesson: Lesson;
    private loading;
    private modifica = false;
    private cancelButton: string;
    private doneButton: string;
    private pleaseWaitMessage: string;

    constructor(
        private pickerCtrl: PickerController,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private subjectService: SubjectService,
        private lessonService: LessonService,
        private modalController: ModalController,
        private loadingController: LoadingController,
        private translateService: TranslateService,
        private route: ActivatedRoute,
        private alertController: AlertController,
        private planningService: PlanningService,
        private navController: NavController) {
    }

    ngOnInit() {
        this.initTranslate();
        this.teacher$ = this.userService.getUser();
        this.route.data.subscribe((data) => {
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
            this.lesson.name = this.lezioneFormModel.value.name;
            this.lesson.price = this.lezioneFormModel.value.price;
            this.lesson.description = this.lezioneFormModel.value.description;
            this.lesson.teacher = teacher;
            this.lesson.subject.macroSubject = this.materia;
            this.lesson.subject.microSubject = this.sottoMateria;
            this.lessonService.createRestLesson(this.lesson).subscribe((idLezione) => {
                this.presentaAlert(idLezione);
            });
        });
    }

    async presentaAlert(idLezione: string) {
        const alert = await this.alertController.create({
            header: 'Lezione creata',
            message: 'La lezzione al momento non ha pianificazioni. Vuoi aggiungerne?',
            buttons: [
                {
                    text: this.cancelButton,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.navController.navigateRoot('lista-annunci-publicati');
                    }
                }, {
                    text: 'Si',
                    handler: () => {
                        this.navController.navigateRoot('lista-pianificazioni/' + idLezione);
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
        this.navController.back();
    }

    async inputNuovaMateria() {
        const alert = await this.alertController.create({
            header: 'Inserisci la nuova MATERIA:',
            inputs: [{type: 'text', placeholder: 'Materia'}],
            buttons: [{
                text: 'Cancel',
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
            header: 'Inserisci la nuova SOTTOMATERIA:',
            inputs: [{type: 'text', placeholder: 'Sotto Materia'}],
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
