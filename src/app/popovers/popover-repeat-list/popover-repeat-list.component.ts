import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {Planning} from '../../model/planning.model';
import {PlanningService} from '../../services/planning.service';
import {DettagliPianificazioneModalPage} from '../../pages/dettagli-pianificazione-modal-page/dettagli-pianificazione-modal-page.page';
import {Lesson} from '../../model/lesson.model';

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

    constructor(private navParams: NavParams,
                private modalController: ModalController,
                private alertController: AlertController,
                private planningService: PlanningService) {
    }

    ngOnInit() {
        this.plannings = this.navParams.get('plannings');
        this.lesson = this.plannings[0].lesson;
        this.date = this.navParams.get('date');
        this.oreInizioEFine = this.navParams.get('oreInizioEFine');
    }

    async eliminaPianificazione(pianificazione: Planning) {
        const message = 'Sei sicuro di voler cancellare la pianificazione del '
            + new Date(pianificazione.date).toLocaleDateString() + ' alle '
            + pianificazione.startTime.slice(0, 5) + '?';
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
                        this.planningService.deleteRestPlanning([pianificazione]).subscribe(() => {
                        });
                    }
                }
            ]
        });

        await alert.present();
    }

    async modificaPianificazione(pianificazione: Planning) {
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
                pianificazione.lesson = this.lesson;
                this.planningService.modifyRestPlannings([pianificazione], this.lesson.idLesson).subscribe(() => {
                });
            } else {
                console.log('modifica annullata');
            }
        });
        await modal.present();
    }
}
