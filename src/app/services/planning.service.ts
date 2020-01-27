import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Planning} from '../model/planning.model';
import {URL} from '../constants';
import {map} from 'rxjs/operators';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})

export class PlanningService {
    public plannings$: BehaviorSubject<Planning[]> = new BehaviorSubject<Planning[]>([] as Planning[]);

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
    }

    getRestPlanningByIdLesson(idLesson: string): Observable<Planning[]> {
        return this.http.get<Planning[]>(URL.PLANNING + '/' + idLesson, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Planning[]>) => {
                return resp.body;
            })
        );
    }

    getRestPlannings(macroMateria: string, nomeLezione: string,
                     citta: string, microMateria: string,
                     domenica: number, lunedi: number, martedi: number,
                     mercoledi: number, giovedi: number, venerdi: number,
                     sabato: number, oraInizio: string, oraFine: string): Observable<Planning[]> {
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
                'ora-fine': oraFine
            }
        }).pipe(
            map((resp: HttpResponse<Planning[]>) => {
                this.plannings$.next(resp.body);
                return resp.body;
            })
        );
    }
    createRestPlannings(plannings: Planning[]): Observable<any> {
        return this.http.post<any>(URL.PLANNING_CREATE, plannings, {observe: 'response'});
    }
    modifyRestPlannings(plannings: Planning[]): Observable<any> {
        return this.http.put<any>(URL.PLANNING_MODIFY, plannings, {observe: 'response'});
    }
    getPlannings(): BehaviorSubject<Planning[]> {
        return this.plannings$;
    }
}
