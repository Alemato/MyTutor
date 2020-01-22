import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AUTH_TOKEN, STORAGE, URL} from '../constants';
import {map} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {BehaviorSubject, Observable} from 'rxjs';
import {Lesson} from '../model/lesson.model';
import {Booking} from '../model/booking.model';

@Injectable({
    providedIn: 'root'
})
export class LessonService {
    public lessons$: BehaviorSubject<Lesson[]> = new BehaviorSubject<Lesson[]>([] as Lesson[]);

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
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

    modifyRestLesson(lesson: Lesson): Observable<any> {
        return this.http.put(URL.LESSON_MODIFY, lesson);
    }

    setStorageLesson(lessons: Lesson[]) {
        this.storage.set(STORAGE.LESSON, lessons);
    }

    getLessons(): BehaviorSubject<Lesson[]> {
        return this.lessons$;
    }
}
