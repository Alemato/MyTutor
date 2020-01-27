import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {STORAGE, URL} from '../constants';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Lesson} from '../model/lesson.model';

@Injectable({
    providedIn: 'root'
})
export class LessonService {
    public lessons$: BehaviorSubject<Lesson[]> = new BehaviorSubject<Lesson[]>([] as Lesson[]);

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
        this.getRestLessons();
        this.storage.get(STORAGE.LESSON).then((item: Lesson[]) => {
            this.lessons$.next(item);
        });
    }

    getRestLessons(): Observable<Lesson[]> {
        return this.http.get<Lesson[]>(URL.LESSON, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Lesson[]>) => {
                this.lessons$.next(resp.body);
                this.setStorageLesson(resp.body);
                return resp.body;
            })
        );
    }

    setStorageLesson(lessons: Lesson[]) {
        this.storage.set(STORAGE.LESSON, lessons);
    }

    getLessons(): BehaviorSubject<Lesson[]> {
        return this.lessons$;
    }

    logout() {
        this.storage.remove(STORAGE.LESSON);
        this.lessons$ = new BehaviorSubject<Lesson[]>([] as Lesson[]);
    }
}
