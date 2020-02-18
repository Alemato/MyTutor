import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PlanningService} from '../../services/planning.service';
import {BehaviorSubject} from 'rxjs';
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
    private planning$: BehaviorSubject<Planning[]>;
    private listIdPlanning = [];
    private listItem: Planning[] = [];
    private idLesson: string;

    private setLanguage = 'it-IT';

    constructor(private route: ActivatedRoute,
                private planningService: PlanningService,
                private modalController: ModalController,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.planning$ = this.planningService.getPlannings();
        this.planning$.subscribe((plannings) => {
            this.listItem = [];
            let listItemAppoggio: Planning[] = [];
            this.listIdPlanning = [];
            let listIdAppoggio: number[];
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
        });
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
                listPlanning: this.planning$.getValue(),
                itemP: this.listItem[index],
                listIdexP: this.listIdPlanning[index]
            }
        });
        modal.onDidDismiss().then((data) => {
            if (data !== undefined && data.data !== undefined) {
                if (data.data.isCreate) {
                    this.planningService.getRestPlanningByIdLesson(this.idLesson).subscribe(() => {});
                }
            }
        });
        await modal.present();
    }

    ionViewWillEnter() {
        this.route.paramMap.subscribe((params) => {
            this.idLesson = params.get('idLesson');
            this.planningService.getRestPlanningByIdLesson(this.idLesson).subscribe(() => {});
        });
    }

    private initTranslate() {
        this.translateService.get('SET_LANGUAGE').subscribe((data) => {
            this.setLanguage = data;
        });
    }
}
