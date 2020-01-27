import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Subject} from '../model/subject.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {URL} from '../constants';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    public listSubject$: BehaviorSubject<Subject[]> = new BehaviorSubject<Subject[]>([] as any);

    constructor(private http: HttpClient) {
    }

    getRestList(hy: boolean): Observable<any> {
        if (hy) {
            return this.http.get<any>(URL.SUBJECT, {
                observe: 'response',
                params: {history: 'true'}
            }).pipe(map((resp: HttpResponse<any>) => {
                this.listSubject$.next(resp.body);
                return resp.body;
            }));
        } else {
            return this.http.get<any>(URL.SUBJECT, {observe: 'response'}).pipe(map((resp: HttpResponse<any>) => {
                this.listSubject$.next(resp.body);
                return resp.body;
            }));
        }
    }

    getListSubjet() {
        return this.listSubject$;
    }

    logout() {
        this.listSubject$ = new BehaviorSubject<Subject[]>([] as any);
    }
}
