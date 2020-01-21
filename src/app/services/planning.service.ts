import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Planning} from '../model/planning.model';
import {STORAGE, URL} from '../constants';
import {map} from 'rxjs/operators';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
    providedIn: 'root'
})
export class PlanningService {
    public plannings$: BehaviorSubject<Planning[]> = new BehaviorSubject<Planning[]>({} as Planning[]);

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

    getRestPlannings(idLesson: string): Observable<Planning[]> {
        return this.http.get<Planning[]>(URL.PLANNING_RESEARCH, {
            observe: 'response',
            params: {
            }
            }, ).pipe(
            map((resp: HttpResponse<Planning[]>) => {
                this.plannings$.next(resp.body);
                this.setStoragePlanning(resp.body);
                return resp.body;
            })
        );
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
