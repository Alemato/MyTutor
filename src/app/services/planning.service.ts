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
    private plannings$: BehaviorSubject<Planning[]> = new BehaviorSubject<Planning[]>([] as Planning[]);

    constructor(
        private http: HttpClient
    ) {
    }

    /**
     * Rest per la lista delle pianificazioni di una lezione
     * @param idLesson id della lezione
     */
    getRestPlanningByIdLesson(idLesson: string): Observable<Planning[]> {
        return this.http.get<Planning[]>(URL.PLANNING + '/' + idLesson, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Planning[]>) => {
                this.plannings$.next(resp.body);
                return resp.body;
            })
        );
    }

    /**
     * Rest di ricerca delle pianificazioni filtrate
     * @param macroMateria macroMateria
     * @param nomeLezione nome della lezione
     * @param citta della lezione
     * @param microMateria microMateria
     * @param domenica giorno della settimana domenica
     * @param lunedi giorno della settimana lunedi
     * @param martedi giorno della settimana martedi
     * @param mercoledi giorno della settimana mercoledi
     * @param giovedi giorno della settimana giovedi
     * @param venerdi giorno della settimana venerdi
     * @param sabato giorno della settimana sabato
     * @param oraInizio ora di inizio
     * @param oraFine ora di fice
     * @param price prezzo della lezione
     */
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

    /**
     * Rest che ritorna la lista di pianificazioni passando l'id di lezione
     * @param idLezione id della lezione
     */
    planningsByIdL(idLezione: number): Observable<Planning[]> {
        return this.http.get<Planning[]>(URL.PLANNING_BY_ID_LESSON + '/' + idLezione);
    }

    /**
     * Rest per la lista delle pianificazione usate nella lista degli annunci pubblicati del professore
     */
    getRestPlanningsAsLesson(): Observable<Planning[]> {
        return this.http.get<Planning[]>(URL.PLANNING);
    }

    /**
     * Rest di eliminazione di una lista di pianificazioni
     * @param plannings lista di pianificazioni da cancellare
     */
    deleteRestPlanning(plannings: Planning[]): Observable<any> {
        return this.http.put<any>(URL.PLANNING_DELETE, plannings, {observe: 'response'});
    }

    /**
     * Rest di creazione della pianificazione
     * @param planning pianificazione da creare
     */
    createRestPlannings(planning: Planning): Observable<any> {
        return this.http.post<any>(URL.PLANNING_CREATE, planning, {observe: 'response'});
    }

    /**
     * Rest di modifica delle pianificazioni
     * @param plannings pianificazioni da modificare
     * @param idLesson id della lezione collegata alle pianificazioni
     */
    modifyRestPlannings(plannings: Planning[], idLesson: number): Observable<any> {
        return this.http.put<any>(URL.PLANNING_MODIFY, plannings, {
            observe: 'response',
            params: {
                'id-lesson': idLesson.toString()
            }
        });
    }

    /**
     * Rest che ritorna una pianificazione tramite l'id
     * @param idPlanning id pianificazione
     */
    getRestPlanningById(idPlanning: string): Observable<Planning> {
        return this.http.get<Planning>(URL.PLANNING_BY_ID + '/' + idPlanning, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Planning>) => {
                return resp.body;
            })
        );
    }

    /**
     * Ritorna il BehaviorSubject pianificazioni
     */
    getPlannings(): BehaviorSubject<Planning[]> {
        return this.plannings$;
    }

    /**
     * Funzione di reset per il logout
     */
    logout() {
        this.plannings$ = new BehaviorSubject<Planning[]>([] as Planning[]);
    }
}
