import {Component, OnInit} from '@angular/core';
import {LessonService} from '../../services/lesson.service';
import {BehaviorSubject} from 'rxjs';
import {Lesson} from '../../model/lesson.model';

@Component({
    selector: 'app-lista-annunci-publicati',
    templateUrl: './lista-annunci-publicati.page.html',
    styleUrls: ['./lista-annunci-publicati.page.scss'],
})
export class ListaAnnunciPublicatiPage implements OnInit {
    public lessons$: BehaviorSubject<Lesson[]>;

    constructor(private lessonService: LessonService) {
    }

    ngOnInit() {
        this.lessons$ = this.lessonService.getLessons();
        this.lessonService.getRestLessons().subscribe((item) => {
            console.log(item);
        });
    }

}
