import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Planning} from '../model/planning.model';
import {STORAGE, URL} from '../constants';
import {map} from 'rxjs/operators';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Student} from '../model/student.model';

export interface Plan {
    slot: Map<number, string[]>;
}

@Injectable({
    providedIn: 'root'
})

export class PlanningService {
    public plannings$: BehaviorSubject<Planning[]> = new BehaviorSubject<Planning[]>([] as Planning[]);

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
        // this.http.get<Planning[]>(URL.PLANNING_RESEARCH, {observe: 'response'}).pipe(
        //     map((resp: HttpResponse<Planning[]>) => {
        //         this.plannings$.next(resp.body);
        //         this.setStoragePlanning(resp.body);
        //         return resp.body;
        //     })
        // );
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



    setStoragePlanning(planning: Planning[]) {
        this.storage.set(STORAGE.PLANNING, planning);
    }

    getStoragePlanning(): Observable<Planning[]> {
        return fromPromise(this.storage.get(STORAGE.PLANNING));
    }

    addOneStoragePlanning(planning: Planning) {
        this.getStoragePlanning().subscribe((planningList) => {
            if (planningList) {
                const plannings: Planning[] = planningList;
                plannings.push(planning);
                this.storage.set(STORAGE.PLANNING, plannings);
            } else {
                const plannings: Planning[] = [];
                plannings.push(planning);
                this.storage.set(STORAGE.PLANNING, plannings);
            }
        });
    }

    getPlannings(): BehaviorSubject<Planning[]> {
        return this.plannings$;
    }
}
