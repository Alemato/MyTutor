import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertController, IonItemSliding, ModalController, PopoverController} from '@ionic/angular';
import {BehaviorSubject, Observable} from 'rxjs';
import {Planning} from '../../model/planning.model';
import {PlanningService} from '../../services/planning.service';
import {Lesson} from '../../model/lesson.model';
import {LessonService} from '../../services/lesson.service';
import {DettagliPianificazioneModalPage} from '../dettagli-pianificazione-modal-page/dettagli-pianificazione-modal-page.page';
import {PopoverRepeatListComponent} from '../../popovers/popover-repeat-list/popover-repeat-list.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-lista-pianificazioni',
    templateUrl: './lista-pianificazioni.page.html',
    styleUrls: ['./lista-pianificazioni.page.scss'],
})
export class ListaPianificazioniPage implements OnInit {
    private plannings$: BehaviorSubject<Planning[]>;
    private lesson$: Observable<Lesson>;
    private idLezione: number;
    private date: number[] = [];
    private oreInizioEFine: any[] = [];
    private pianificazioni: Planning[] = [];
    private pianificazioniRipetute: Planning[][] = [];
    private disableSliding = false;
    private lezione: Lesson = new Lesson();

    private messageQuest: string;
    private cancelPlanning: string;
    private datetimeTo: string;
    private cancelButton: string;
    private deleteButton: string;
    private setLanguage = 'it-IT';

    constructor(public popoverController: PopoverController,
                private route: ActivatedRoute,
                private modalController: ModalController,
                private alertController: AlertController,
                private planningService: PlanningService,
                private lessonService: LessonService,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.route.data.subscribe((data) => {
            this.plannings$ = this.planningService.getPlannings();
            this.idLezione = data.idLezione;
            if (!data.isInsert) {
                this.lesson$ = this.lessonService.getLessonById(data.idLezione);
                this.lesson$.subscribe((lezione) => {
                    this.lezione = lezione;
                    if (!data.noPlanning) {
                        this.listaPianificazioni();
                    } else {
                        this.creaPianificazione(0);
                    }
                });
            } else {
                this.lesson$ = this.lessonService.getLessonByUrl(data.urlLezione);
                this.lesson$.subscribe((lezione) => {
                    this.lezione = lezione;
                    this.creaPianificazione(0);
                });
            }
        });
    }

    ionViewWillEnter() {
        this.pianificazioni = [];
        this.pianificazioniRipetute = [];
        this.planningService.getRestPlanningByIdLesson(this.idLezione.toString()).subscribe(() => {
        });
    }

    async creaPianificazione(i: number) {
        let pianificazione = new Planning();
        const modal = await this.modalController.create({
            component: DettagliPianificazioneModalPage,
            componentProps: {
                planning: pianificazione,
                date: this.date,
                ore: this.oreInizioEFine
            }
        });
        modal.onDidDismiss().then((detail) => {
            if (detail !== null && detail.data !== undefined) {
                pianificazione = detail.data;
                pianificazione.lesson = this.lezione;
                pianificazione.available = true;
                this.planningService.createRestPlannings(pianificazione).subscribe(() => {
                    this.planningService.getRestPlanningByIdLesson(pianificazione.lesson.idLesson.toString()).subscribe(() => {
                        if (i === 0) {
                            this.listaPianificazioni();
                            i++;
                        }
                    });
                });
            } else {
                console.log('creazione annullata');
            }
        });
        await modal.present();
    }

    async modificaPianificazione(pianificazione: Planning, sliding: IonItemSliding) {
        await sliding.close();
        const modal = await this.modalController.create({
            component: DettagliPianificazioneModalPage,
            componentProps: {
                gruppo: pianificazione.repeatPlanning,
                planning: pianificazione,
                date: this.date,
                ore: this.oreInizioEFine
            }
        });
        modal.onDidDismiss().then((detail) => {
            if (detail !== null && detail.data !== undefined) {
                if (pianificazione.repeatPlanning) {
                    pianificazione = detail.data;
                    pianificazione.lesson = this.lezione;
                    const idPianificazione = this.pianificazioni.findIndex(p => p.idPlanning === pianificazione.idPlanning);
                    this.pianificazioni = [];
                    const pianificazioniDaModificare: Planning[] = [];
                    this.pianificazioniRipetute[idPianificazione].forEach((pianificazioneDaModificare) => {
                        pianificazioniDaModificare.push(pianificazioneDaModificare);
                    });
                    pianificazioniDaModificare[0].date = pianificazione.date;
                    pianificazioniDaModificare[0].startTime = pianificazione.startTime;
                    pianificazioniDaModificare[0].endTime = pianificazione.endTime;
                    pianificazioniDaModificare[0].repeatPlanning = pianificazione.repeatPlanning;
                    this.pianificazioniRipetute = [];
                    this.planningService.modifyRestPlannings(pianificazioniDaModificare, this.lezione.idLesson).subscribe(() => {
                        this.planningService.getRestPlanningByIdLesson(this.idLezione.toString()).subscribe(() => {
                        });
                    });
                } else {
                    this.pianificazioni = [];
                    this.pianificazioniRipetute = [];
                    this.planningService.modifyRestPlannings([pianificazione], this.lezione.idLesson).subscribe(() => {
                        this.planningService.getRestPlanningByIdLesson(this.idLezione.toString()).subscribe(() => {
                        });
                    });
                }
            } else {
                console.log('modifica annullata');
            }
        });
        await modal.present();
    }

    async eliminaPianificazione(pianificazione: Planning, sliding: IonItemSliding) {
        await sliding.close();
        // tslint:disable-next-line:max-line-length
        const message = this.messageQuest + new Date(pianificazione.date).toLocaleDateString() + this.datetimeTo + pianificazione.startTime.slice(0, 5) + '?';
        const alert = await this.alertController.create({
            header: this.cancelPlanning,
            message,
            buttons: [
                {
                    text: this.cancelButton,
                    handler: () => {
                        console.log('Cancellazione Annulata');
                    }
                },
                {
                    text: this.deleteButton,
                    handler: () => {
                        const idPianificazione = this.pianificazioni.findIndex(p => p.idPlanning === pianificazione.idPlanning);
                        if (this.pianificazioniRipetute[idPianificazione]) {
                            this.planningService.deleteRestPlanning(this.pianificazioniRipetute[idPianificazione]).subscribe(() => {
                                this.pianificazioni = [];
                                this.pianificazioniRipetute = [];
                                this.planningService.getRestPlanningByIdLesson(this.idLezione.toString()).subscribe(() => {
                                });
                            });
                        } else {
                            this.pianificazioni = [];
                            this.pianificazioniRipetute = [];
                            this.planningService.deleteRestPlanning([pianificazione]).subscribe(() => {
                                this.planningService.getRestPlanningByIdLesson(this.idLezione.toString()).subscribe(() => {
                                });
                            });
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    async presentPopover(event: any, plannings: Planning[]) {
        const popover = await this.popoverController.create({
            backdropDismiss: true,
            component: PopoverRepeatListComponent,
            event,
            cssClass: 'popover-dimension',
            translucent: true,
            componentProps: {
                plannings,
                date: this.date,
                oreInizioEFine: this.oreInizioEFine
            }
        });
        popover.onDidDismiss().then(() => {
            if (this.plannings$.value.find(x => x.available === false)) {
                this.planningService.getRestPlanningByIdLesson(this.idLezione.toString()).subscribe(() => {
                });
            }
        });
        return await popover.present();
    }

    listaPianificazioni() {
        this.plannings$.subscribe((pianificazioni) => {
            this.pianificazioni = [];
            this.pianificazioniRipetute = [];
            pianificazioni.forEach((pianificazione) => {
                // tslint:disable-next-line:max-line-length
                const indicePianificazioni = this.pianificazioni.findIndex(p => new Date(p.date).getDay() === new Date(pianificazione.date).getDay() && p.startTime === pianificazione.startTime);
                if (indicePianificazioni === -1) {
                    this.pianificazioni.push(pianificazione);
                }
            });
            this.pianificazioni.forEach((pianificazione) => {
                if (pianificazione.repeatPlanning === true) {
                    const listaPianificazioniRipetute: any[] = [];
                    pianificazioni.forEach((pianificazioneRipetuta) => {
                        // tslint:disable-next-line:max-line-length
                        if (new Date(pianificazioneRipetuta.date).getDay() === new Date(pianificazione.date).getDay() && pianificazioneRipetuta.startTime === pianificazione.startTime) {
                            listaPianificazioniRipetute.push(pianificazioneRipetuta);
                        }
                    });
                    this.pianificazioniRipetute.push(listaPianificazioniRipetute);
                }
            });
            this.date = [];
            this.oreInizioEFine = [];
            pianificazioni.forEach((pianificazione) => {
                const indiceData = this.date.findIndex(d => d === new Date(pianificazione.date).getTime());
                if (indiceData === -1) {
                    this.date.push(new Date(pianificazione.date).getTime());
                    const oraInizioEFine: any[] = [];
                    pianificazioni.forEach((pianificazionePerOre) => {
                        if (pianificazionePerOre.date === pianificazione.date) {
                            const indiceOre = oraInizioEFine.findIndex(o => o.startTime === pianificazionePerOre.startTime);
                            if (indiceOre === -1) {
                                oraInizioEFine.push({
                                    startTime: pianificazionePerOre.startTime,
                                    endTime: pianificazionePerOre.endTime
                                });
                            }
                        }
                    });
                    this.oreInizioEFine.push(oraInizioEFine);
                }
            });
        });
    }

    private initTranslate() {
        this.translateService.get('MESSAGE_QUEST').subscribe((data) => {
            this.messageQuest = data;
        });
        this.translateService.get('CANCEL_PLANNING').subscribe((data) => {
            this.cancelPlanning = data;
        });
        this.translateService.get('DATETIME_TO').subscribe((data) => {
            this.datetimeTo = data;
        });
        this.translateService.get('CANCEL_BUTTON').subscribe((data) => {
            this.cancelButton = data;
        });
        this.translateService.get('DELETE_BUTTON').subscribe((data) => {
            this.deleteButton = data;
        });
        this.translateService.get('SET_LANGUAGE').subscribe((data) => {
            this.setLanguage = data;
        });
    }
}
