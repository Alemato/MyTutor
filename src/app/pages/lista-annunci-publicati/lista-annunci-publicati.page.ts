import {Component, OnInit} from '@angular/core';
import {LessonService} from '../../services/lesson.service';
import {BehaviorSubject} from 'rxjs';
import {Lesson} from '../../model/lesson.model';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-lista-annunci-publicati',
    templateUrl: './lista-annunci-publicati.page.html',
    styleUrls: ['./lista-annunci-publicati.page.scss'],
})
export class ListaAnnunciPublicatiPage implements OnInit {
    public lessons$: BehaviorSubject<Lesson[]>;
    private loading;

    constructor(private lessonService: LessonService,
                public loadingController: LoadingController) {
    }

    ngOnInit() {
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
            message: 'Please wait...',
            translucent: true
        });
        return await this.loading.present();
    }

    async disLoading() {
        await this.loading.dismiss();
    }

}
