import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

import {AUTH_TOKEN, URL, UTENTE_STORAGE, X_AUTH} from '../constants';
import {User} from '../model/user.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {Student} from '../model/student.model';
import {Teacher} from '../model/teacher.model';

export interface Account {
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private authToken: string;
    private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private student$: BehaviorSubject<Student> = new BehaviorSubject<Student>({} as Student);
    private teacher$: BehaviorSubject<Teacher> = new BehaviorSubject<Teacher>({} as Teacher);
    private type: string;
    public exist: boolean;

    constructor(private http: HttpClient, private storage: Storage) {
        this.storage.get('loggedIn').then((loggedIn) => {
            if (loggedIn) {
                console.log('dallo storage di loggedIn ho preso true');
                this.loggedIn$.next(true);
            } else {
                console.log('dallo storage di loggedIn ho preso false');
                this.loggedIn$.next(false);
            }
        });
        this.storage.get(AUTH_TOKEN).then((token) => {
            this.authToken = token;
            if (token !== null && token !== undefined && token !== '') {
                console.log('token dallo storage');
                console.log(token);
                this.loggedIn$.next(true);
            }
        });
        this.storage.get(UTENTE_STORAGE).then((utente) => {
            console.log('utente');
            if (utente) {
                console.log('whichUserType()');
                this.whichUserType().then((tipo) => {
                    console.log('tipo');
                    console.log(tipo);
                    if (tipo === 'teacher') {
                        this.teacher$.next(utente);
                    } else if (tipo === 'student') {
                        this.student$.next(utente);
                    } else if (tipo === 'admin') {
                        console.log('io sono admin');
                    }
                });
            }
        });

    }

    login(account: Account): Observable<any> {
        return this.http.post<any>(URL.LOGIN, account, {observe: 'response'}).pipe(
            map((resp: HttpResponse<any>) => {
                const token = resp.headers.get(X_AUTH);
                console.log('token dal server');
                console.log(token);
                this.storage.set(AUTH_TOKEN, token).then();
                this.authToken = token;
                this.storage.set(UTENTE_STORAGE, resp.body).then();
                if (resp.headers.get('X-User-Type') === 'student') {
                    console.log('setto studente');
                    this.student$.next(resp.body);
                } else if (resp.headers.get('X-User-Type') === 'teacher') {
                    console.log('professoreeeee');
                    this.teacher$.next(resp.body);
                } else if (resp.headers.get('X-User-Type') === 'admin') {
                    console.log('I\'m Admin');
                }
                this.storage.set('typeUser', resp.headers.get('X-User-Type')).then();
                this.loggedIn$.next(true);
                this.setLoggeIn(true);
                console.log('setto loggedIn nello storage e in loggedIn$');
                return resp.body;
            }));
    }

    ifExistKey(value: string): Promise<boolean> {
        return this.storage.get(value).then(data => {
            if (data) {
                return true;
            } else {
                return false;
            }
            }
        );
    }

    async setLoggeIn(value: boolean) {
        await this.storage.set('loggedIn', value);
    }

    async neodimio() {
        await this.storage.set('loggedIn', false);
        await this.storage.remove('typeUser');
        await this.storage.remove(UTENTE_STORAGE);
        await this.storage.remove(AUTH_TOKEN);
    }

    async logout() {
        this.authToken = null;
        this.loggedIn$.next(false);
        this.neodimio();
    }

    prendiUtente() {
        this.storage.get(UTENTE_STORAGE).then((utente) => {
            console.log('utente');
            if (utente) {
                console.log('whichUserType()');
                this.whichUserType().then((tipo) => {
                    console.log('tipo');
                    console.log(tipo);
                    if (tipo === 'teacher') {
                        this.teacher$.next(utente);
                    } else if (tipo === 'student') {
                        this.student$.next(utente);
                    } else if (tipo === 'admin') {
                        console.log('io sono admin');
                    }
                });
            }
        });
    }

    prendiLoggato() {
        this.storage.get('loggedIn').then((loggedIn) => {
            if (loggedIn) {
                console.log('dallo storage di loggedIn ho preso true');
                this.loggedIn$.next(true);
            } else {
                console.log('dallo storage di loggedIn ho preso false');
                this.loggedIn$.next(false);
            }
        });
    }

    prendiToken() {
        this.storage.get(AUTH_TOKEN).then((token) => {
            this.authToken = token;
            if (token !== null && token !== undefined && token !== '') {
                console.log('token dallo storage');
                console.log(token);
                this.loggedIn$.next(true);
            }
        });
    }

    getStudent(): BehaviorSubject<Student> {
        this.prendiUtente();
        return this.student$;
    }

    getTeacher(): BehaviorSubject<Teacher> {
        this.prendiUtente();
        return this.teacher$;
    }

    getAuthToken(): string {
        this.prendiToken();
        return this.authToken;
    }

    isLogged(): Observable<boolean> {
        this.prendiLoggato();
        return this.loggedIn$.asObservable();
    }

    async whichUserType(): Promise<string> {
        await this.storage.get('typeUser').then((tipo) => {
            this.type = tipo;
        });
        return this.type;
    }
}
