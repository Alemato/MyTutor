import {Component, OnInit} from '@angular/core';
import {LessonService} from '../../services/lesson.service';
import {BehaviorSubject} from 'rxjs';
import {Lesson} from '../../model/lesson.model';
import {LoadingController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-lista-annunci-publicati',
    templateUrl: './lista-annunci-publicati.page.html',
    styleUrls: ['./lista-annunci-publicati.page.scss'],
})
export class ListaAnnunciPublicatiPage implements OnInit {
    public lessons$: BehaviorSubject<Lesson[]>;
    private loading;
    private pleaseWaitMessage: string;

    constructor(private lessonService: LessonService,
                public loadingController: LoadingController,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.lessons$ = this.lessonService.getLessons();
        this.loadingPresent().then(() => {
            // this.getlezioni();
            this.lessonService.getRestLessons().subscribe((item) => {
                this.lessons$.next(item);
                this.disLoading();
            });
        });
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
}
