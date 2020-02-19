import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PlanningService} from '../../services/planning.service';
import {Planning} from '../../model/planning.model';
import {ModalController} from '@ionic/angular';
import {CreazionePrenotazioneModalPage} from '../creazione-prenotazione-modal/creazione-prenotazione-modal.page';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-lista-per-prenotarsi',
    templateUrl: './lista-per-prenotarsi.page.html',
    styleUrls: ['./lista-per-prenotarsi.page.scss'],
})
export class ListaPerPrenotarsiPage implements OnInit {
    private listIdPlanning = [];
    private listItem: Planning[] = [];
    private plannings: Planning[] = [];
    private idLesson: string;

    private setLanguage = 'it-IT';

    private loading = true;

    constructor(private route: ActivatedRoute,
                private planningService: PlanningService,
                private modalController: ModalController,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.idLesson = params.get('idLesson');
            this.initTranslate();
            this.loading = true;
            this.planningService.planningsByIdL(parseInt(this.idLesson, 0)).subscribe((plannings) => {
                this.createListIntemPage(plannings);
                this.loading = false;
            });
        });
    }

    createListIntemPage(plannings: Planning[]) {
        this.plannings = plannings;
        this.listItem = [];
        let listItemAppoggio: Planning[] = [];
        this.listIdPlanning = [];
        let listIdAppoggio: number[] = [];
        plannings.forEach((planning) => {
            // controllo se è presente un planning con la stessa data
            if (listItemAppoggio.findIndex(p => p.date === planning.date) === -1) {
                this.listItem = this.listItem.concat(listItemAppoggio);
                if (listIdAppoggio !== undefined) {
                    this.listIdPlanning.push(listIdAppoggio);
                }
                listItemAppoggio = [];
                listIdAppoggio = [];
                listItemAppoggio.push(this.clonePlanning(planning));
                listIdAppoggio.push(planning.idPlanning);
            } else {
                // controllo se devo accorpare gli start ed end Time o devo aggiungere un nuovo elemento planning
                if (listItemAppoggio[listItemAppoggio.length - 1].endTime === planning.startTime) {
                    listItemAppoggio[listItemAppoggio.length - 1].endTime = planning.endTime;
                    listIdAppoggio.push(planning.idPlanning);
                } else {
                    this.listIdPlanning.push(listIdAppoggio);
                    listIdAppoggio = [];
                    listItemAppoggio.push(this.clonePlanning(planning));
                    listIdAppoggio.push(planning.idPlanning);
                }
            }
        });
        this.listItem = this.listItem.concat(listItemAppoggio);
        this.listIdPlanning.push(listIdAppoggio);
        this.loading = false;
    }

    clonePlanning(planning: Planning): Planning {
        const p = new Planning();
        p.idPlanning = planning.idPlanning;
        p.date = planning.date;
        p.startTime = planning.startTime;
        p.endTime = planning.endTime;
        p.available = planning.available;
        p.repeatPlanning = planning.repeatPlanning;
        p.lesson = planning.lesson;
        return p;
    }

    async presentPrenotazione(index: number) {
        const modal = await this.modalController.create({
            component: CreazionePrenotazioneModalPage,
            componentProps: {
                listPlanning: this.plannings,
                itemP: this.listItem[index],
                listIdexP: this.listIdPlanning[index]
            }
        });
        modal.onDidDismiss().then((data) => {
            if (data !== undefined && data.data !== undefined) {
                if (data.data.isCreate) {
                    this.loading = true;
                    this.planningService.planningsByIdL(parseInt(this.idLesson, 0)).subscribe((plannings) => {
                        this.createListIntemPage(plannings);
                        this.loading = false;
                    });
                }
            }
        });
        await modal.present();
    }

    ionViewWillEnter() {
        this.loading = true;
        this.planningService.planningsByIdL(parseInt(this.idLesson, 0)).subscribe( (plannings) => {
            this.createListIntemPage(plannings);
            this.loading = false;
        });
    }

    private initTranslate() {
        this.translateService.get('SET_LANGUAGE').subscribe((data) => {
            this.setLanguage = data;
        });
    }

}
