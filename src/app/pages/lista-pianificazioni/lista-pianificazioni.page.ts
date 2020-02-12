import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AlertController, IonContent, IonItemSliding, ModalController, PopoverController} from '@ionic/angular';
import {BehaviorSubject, Observable} from 'rxjs';
import {Planning} from '../../model/planning.model';
import {PlanningService} from '../../services/planning.service';
import {Lesson} from '../../model/lesson.model';
import {LessonService} from '../../services/lesson.service';
import {DettagliPianificazioneModalPage} from '../dettagli-pianificazione-modal-page/dettagli-pianificazione-modal-page.page';
import {PopoverRepeatListComponent} from '../../popovers/popover-repeat-list/popover-repeat-list.component';

@Component({
    selector: 'app-lista-pianificazioni',
    templateUrl: './lista-pianificazioni.page.html',
    styleUrls: ['./lista-pianificazioni.page.scss'],
})
export class ListaPianificazioniPage implements OnInit {
    @ViewChild(IonContent, {static: false}) contenuto: IonContent;
    private plannings$: Observable<Planning[]>;
    private lesson$: Observable<Lesson>;
    private idLezione: number;
    private date: number[] = [];
    private oreInizioEFine: any[] = [];
    private pianificazioni: Planning[] = [];
    private pianificazioniRipetute: Planning[][] = [];
    private disableSliding = false;

    constructor(public popoverController: PopoverController,
                private route: ActivatedRoute,
                private modalController: ModalController,
                private alertController: AlertController,
                private planningService: PlanningService,
                private lessonService: LessonService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.lesson$ = this.lessonService.getLessonById(parseInt(params.get('idLezione'), 0));
            this.lesson$.subscribe((lezione) => {
                this.idLezione = lezione.idLesson;
                console.log('this.idLezione');
                console.log(this.idLezione);
                this.listaPianificazioni();
            });
        });
    }

    async creaPianificazione() {
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
                this.lesson$.subscribe((lezione) => {
                    pianificazione.lesson = lezione;
                    this.planningService.createRestPlannings(pianificazione).subscribe(() => {
                        this.listaPianificazioni();
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
                planning: pianificazione,
                date: this.date,
                ore: this.oreInizioEFine
            }
        });
        modal.onDidDismiss().then((detail) => {
            if (detail !== null && detail.data !== undefined) {
                pianificazione = detail.data;
                this.lesson$.subscribe((lezione) => {
                    pianificazione.lesson = lezione;
                    const idPianificazione = this.pianificazioni.findIndex(p => p.idPlanning === pianificazione.idPlanning);
                    const pianificazioniDaModificare: Planning[] = [];
                    this.pianificazioniRipetute[idPianificazione].forEach((pianificazioneDaModificare) => {
                        pianificazioneDaModificare.date = pianificazione.date;
                        pianificazioneDaModificare.startTime = pianificazione.startTime;
                        pianificazioneDaModificare.endTime = pianificazione.endTime;
                        pianificazioniDaModificare.push(pianificazioneDaModificare);
                    });
                    this.planningService.modifyRestPlannings(pianificazioniDaModificare, lezione.idLesson).subscribe(() => {
                        this.listaPianificazioni();
                    });
                });
            } else {
                console.log('modifica annullata');
            }
        });
        await modal.present();
    }

    async eliminaPianificazione(pianificazione: Planning, sliding: IonItemSliding) {
        await sliding.close();
        // tslint:disable-next-line:max-line-length
        const message = 'Sei sicuro di voler cancellare la pianificazione del ' + new Date(pianificazione.date).toLocaleDateString() + ' alle ' + pianificazione.startTime.slice(0, 5) + '?';
        const alert = await this.alertController.create({
            header: 'Cancella la pianificazione?',
            message,
            buttons: [
                {
                    text: 'Annulla',
                    handler: () => {
                        console.log('Cancellazione Annulata');
                    }
                },
                {
                    text: 'Cancella',
                    handler: () => {
                        const idPianificazione = this.pianificazioni.findIndex(p => p.idPlanning === pianificazione.idPlanning);
                        this.planningService.deleteRestPlanning(this.pianificazioniRipetute[idPianificazione]).subscribe(() => {
                            this.listaPianificazioni();
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    async presentPopover(event: any, plannings: Planning[]) {
        await this.contenuto.scrollToPoint(0, 200, 200);
        const popover = await this.popoverController.create({
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
            this.listaPianificazioni();
        });
        return await popover.present();
    }

    listaPianificazioni() {
        this.plannings$ = this.planningService.getRestPlanningByIdLesson(this.idLezione.toString());
        this.plannings$.subscribe((pianificazioni) => {
            pianificazioni.forEach((pianificazione) => {
                const indicePianificazioni = this.pianificazioni.findIndex(
                    p => new Date(p.date).getDay() === new Date(pianificazione.date).getDay() &&
                        p.startTime === pianificazione.startTime);
                if (indicePianificazioni === -1) {
                    this.pianificazioni.push(pianificazione);
                }
            });
            this.pianificazioni.forEach((pianificazione) => {
                if (pianificazione.repeatPlanning === true) {
                    const listaPianificazioniRipetute: any[] = [];
                    pianificazioni.forEach((pianificazioneRipetuta) => {
                        if (new Date(pianificazioneRipetuta.date).getDay() === new Date(pianificazione.date).getDay() &&
                            pianificazioneRipetuta.startTime === pianificazione.startTime) {
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
}
