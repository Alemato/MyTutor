import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LoadingController, ModalController, NavController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Planning} from '../../model/planning.model';
import {PlanningService} from '../../services/planning.service';
import {Router} from '@angular/router';
import {Lesson} from '../../model/lesson.model';
import {LessonService} from '../../services/lesson.service';

@Component({
    selector: 'app-lista-annunci-publicati',
    templateUrl: './lista-annunci-publicati.page.html',
    styleUrls: ['./lista-annunci-publicati.page.scss'],
})
export class ListaAnnunciPublicatiPage implements OnInit {
    public plannings$: Observable<Planning[]>;
    public lessons$: Observable<Lesson[]>;
    private loading;
    private pleaseWaitMessage: string;
    private setLanguage = 'it-IT';

    constructor(private planningService: PlanningService,
                private lessonService: LessonService,
                private loadingController: LoadingController,
                private translateService: TranslateService,
                private router: Router,
                private modalController: ModalController,
                private navController: NavController) {
    }

    ngOnInit() {
        this.initTranslate();
        this.listaLezioni();
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

    listaLezioni() {
        this.plannings$ = this.planningService.getRestPlanningsAsLesson();
        this.lessons$ = this.lessonService.getRestLessonsWithoutPlanning();
    }

    pianificazioni(planning: Planning) {
        const root = this.router.config.find(r => r.path === 'lista-pianificazioni');
        root.data = {isInsert: false, noPlanning: false, urlLezione: '', idLezione: planning.lesson.idLesson};
        this.navController.navigateRoot('lista-pianificazioni');
    }

    addPianificazioni(lezione) {
        const root = this.router.config.find(r => r.path === 'lista-pianificazioni');
        if (lezione.idPlanning) {
            root.data = {isInsert: false, noPlanning: true, urlLezione: '', idLezione: lezione.lesson.idLesson};
        } else {
            root.data = {isInsert: false, noPlanning: true, urlLezione: '', idLezione: lezione.idLesson};
        }
        this.navController.navigateRoot('lista-pianificazioni');
    }

    modificaLezione(lezione: Lesson | Planning) {
        const root = this.router.config.find(r => r.path === 'inserimento-lezioni');
        if (lezione instanceof Planning) {
            root.data = {isInsert: false, lesson: lezione.lesson};
        } else {
            root.data = {isInsert: false, lesson: lezione};
        }
        this.navController.navigateRoot('inserimento-lezioni');
    }

    creaLezione() {
        const root = this.router.config.find(r => r.path === 'inserimento-lezioni');
        root.data = {isInsert: true, lesson: {}, listaAnnunci: true};
        this.navController.navigateRoot('inserimento-lezioni');
    }

    private initTranslate() {
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
        this.translateService.get('SET_LANGUAGE').subscribe((data) => {
            this.setLanguage = data;
        });
    }
}
