import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LoadingController, NavController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Planning} from '../../model/planning.model';
import {PlanningService} from '../../services/planning.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-lista-annunci-publicati',
    templateUrl: './lista-annunci-publicati.page.html',
    styleUrls: ['./lista-annunci-publicati.page.scss'],
})
export class ListaAnnunciPublicatiPage implements OnInit {
    public plannings$: Observable<Planning[]>;
    private loading;
    private pleaseWaitMessage: string;

    constructor(private planningService: PlanningService,
                public loadingController: LoadingController,
                private translateService: TranslateService,
                private router: Router,
                private navController: NavController) {
    }

    ngOnInit() {
        this.initTranslate();
        this.listaPlanning();
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
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
    }

    listaPlanning() {
        this.plannings$ = this.planningService.getRestPlanningsAsLesson();
    }

    modificaLezione(planning: Planning) {
        const root = this.router.config.find(r => r.path === 'inserimento-lezioni');
        root.data = {isInsert: false, lesson: planning.lesson};
        this.navController.navigateRoot('inserimento-lezioni');
    }
}
