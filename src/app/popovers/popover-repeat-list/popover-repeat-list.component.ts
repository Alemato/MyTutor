import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {Planning} from '../../model/planning.model';
import {PlanningService} from '../../services/planning.service';
import {DettagliPianificazioneModalPage} from '../../pages/dettagli-pianificazione-modal-page/dettagli-pianificazione-modal-page.page';
import {Lesson} from '../../model/lesson.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-popover-repeat-list',
    templateUrl: './popover-repeat-list.component.html',
    styleUrls: ['./popover-repeat-list.component.scss'],
})
export class PopoverRepeatListComponent implements OnInit {

    public plannings: Planning[];
    private date: number[] = [];
    private oreInizioEFine: any[] = [];
    private lesson: Lesson;

    private messageQuest: string;
    private cancelPlanning: string;
    private datetimeTo: string;
    private cancelButton: string;
    private deleteButton: string;
    private setLanguage = 'it-IT';

    constructor(private navParams: NavParams,
                private modalController: ModalController,
                private alertController: AlertController,
                private planningService: PlanningService,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.plannings = this.navParams.get('plannings');
        this.lesson = this.plannings[0].lesson;
        this.date = this.navParams.get('date');
        this.oreInizioEFine = this.navParams.get('oreInizioEFine');
    }

    /**
     * Eliminazione della pianificazioni
     * @param pianificazione pianificazione da cancellare
     */
    async eliminaPianificazione(pianificazione: Planning) {
        const message = this.messageQuest
            + new Date(pianificazione.date).toLocaleDateString() + this.datetimeTo
            + pianificazione.startTime.slice(0, 5) + '?';
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
                        this.planningService.deleteRestPlanning([pianificazione]).subscribe(() => {
                            const indicePlanning = this.plannings.findIndex(x => x.idPlanning === pianificazione.idPlanning);
                            this.plannings[indicePlanning].available = false;
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    /**
     * Modifica della pianificazione
     * @param pianificazione pianificazione da modificare
     */
    async modificaPianificazione(pianificazione: Planning) {
        const modal = await this.modalController.create({
            component: DettagliPianificazioneModalPage,
            componentProps: {
                gruppo: false,
                planning: pianificazione,
                date: this.date,
                ore: this.oreInizioEFine
            }
        });
        modal.onDidDismiss().then((detail) => {
            if (detail !== null && detail.data !== undefined) {
                pianificazione = detail.data;
                pianificazione.lesson = this.lesson;
                pianificazione.repeatPlanning = false;
                this.planningService.modifyRestPlannings([pianificazione], this.lesson.idLesson).subscribe(() => {
                    const indicePlanning = this.plannings.findIndex(x => x.idPlanning === pianificazione.idPlanning);
                    this.plannings[indicePlanning].available = false;
                });
            } else {
                console.log('modifica annullata');
            }
        });
        await modal.present();
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
