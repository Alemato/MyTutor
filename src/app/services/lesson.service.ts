import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {STORAGE, URL, URL_BASE} from '../constants';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson.model';

@Injectable({
    providedIn: 'root'
})
export class LessonService {

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
    }

    /**
     * Rest di modifica de della lezione
     * @param lesson lezione da modificare
     */
    modifyRestLesson(lesson: Lesson): Observable<any> {
        return this.http.put<any>(URL.LESSON_MODIFY, lesson, {
            observe: 'response'
        });
    }

    /**
     * Rest per la lista delle lezioni visibili dallo studente
     */
    getRestLessonsForStudent(): Observable<Lesson[]> {
        return this.http.get<Lesson[]>(URL.LESSON_ALL_FOR_STUDENT, {observe: 'response'}).pipe(
            map( (resp: HttpResponse<Lesson[]>) => {
                return resp.body;
            })
        );
    }

    /**
     * Rest per prendere la singola lezione tramite l'url della risorsa
     * usata dopo la rest di creazione della lezione che torna l'url della risorsa creata
     * @param url url della risorsa creata
     */
    getLessonByUrl(url: string): Observable<Lesson> {
        const urlR = URL_BASE + url.slice(25);
        console.log(urlR);
        return this.http.get<Lesson>(urlR);
    }

    /**
     * Rest per prendere la singola lezione tramite l'id della lezione
     * @param idLesson id della lezione
     */
    getLessonById(idLesson: number): Observable<Lesson> {
        return this.http.get<Lesson>(URL.LESSON_SINGLE + idLesson);
    }

    /**
     * Rest di creazione della lezione che torna l'url contenuta nell'header nel campo Location
     * @param lesson lezione da creare
     */
    createRestLesson(lesson: Lesson): Observable<string> {
        return this.http.post<string>(URL.LESSON_CREATE, lesson, {observe: 'response'}).pipe(
            map((resp: HttpResponse<string>) => {
                return resp.headers.get('Location');
            })
        );
    }

    /**
     * Rest per le lezioni che non hanno nessuna pianificazione usata nella pagina della lista degli annunci pubblicati
     */
    getRestLessonsWithoutPlanning(): Observable<Lesson[]> {
        return this.http.get<Lesson[]>(URL.LESSON_NO_PLANNING);
    }

    /**
     * Funzione di reset per il logout
     */
    logout() {
        this.storage.remove(STORAGE.LESSON);
    }
}
