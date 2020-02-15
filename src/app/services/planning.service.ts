import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Planning} from '../model/planning.model';
import {URL} from '../constants';
import {map} from 'rxjs/operators';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class PlanningService {
    public plannings$: BehaviorSubject<Planning[]> = new BehaviorSubject<Planning[]>([] as Planning[]);

    constructor(
        private http: HttpClient
    ) {
    }

    getRestPlanningByIdLesson(idLesson: string): Observable<Planning[]> {
        return this.http.get<Planning[]>(URL.PLANNING + '/' + idLesson, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Planning[]>) => {
                this.plannings$.next(resp.body);
                return resp.body;
            })
        );
    }

    getRestPlannings(macroMateria: string, nomeLezione: string,
                     citta: string, microMateria: string,
                     domenica: string, lunedi: string, martedi: string,
                     mercoledi: string, giovedi: string, venerdi: string,
                     sabato: string, oraInizio: string, oraFine: string, price: string): Observable<Planning[]> {
        return this.http.get<Planning[]>(URL.PLANNING_RESEARCH, {
            observe: 'response', params: {
                'macro-materia': macroMateria,
                nome: nomeLezione,
                zona: citta,
                'micro-materia': microMateria,
                dom: domenica.toString(),
                lun: lunedi.toString(),
                mar: martedi.toString(),
                mer: mercoledi.toString(),
                gio: giovedi.toString(),
                ven: venerdi.toString(),
                sab: sabato.toString(),
                'ora-inizio': oraInizio,
                'ora-fine': oraFine,
                prezzo: price
            }
        }).pipe(
            map((resp: HttpResponse<Planning[]>) => {
                this.plannings$.next(resp.body);
                return resp.body;
            })
        );
    }

    getRestPlanningsAsLesson(): Observable<Planning[]> {
        return this.http.get<Planning[]>(URL.PLANNING);
    }

    deleteRestPlanning(plannings: Planning[]): Observable<any> {
        return this.http.post<any>(URL.PLANNING_DELETE, plannings, {observe: 'response'});
    }

    createRestPlannings(planning: Planning): Observable<any> {
        return this.http.post<any>(URL.PLANNING_CREATE, planning, {observe: 'response'});
    }

    modifyRestPlannings(plannings: Planning[], idLesson: number): Observable<any> {
        return this.http.put<any>(URL.PLANNING_MODIFY, plannings, {
            observe: 'response',
            params: {
                'id-lesson': idLesson.toString()
            }
        });
    }

    getPlannings(): BehaviorSubject<Planning[]> {
        return this.plannings$;
    }

    logout() {
        this.plannings$ = new BehaviorSubject<Planning[]>([] as Planning[]);
    }
}
