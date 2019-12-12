import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

import {AUTH_TOKEN, URL, UTENTE_STORAGE, X_AUTH} from '../constants';
import {User} from '../model/user.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
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
            if (utente) {
                this.whichUserType().then((tipo) => {
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
                if (resp.headers.get('X-X-User-Type') === 'student') {
                    console.log('studenteeee');
                    this.student$.next(resp.body);
                } else if (resp.headers.get('X-User-Type') === 'teacher') {
                    console.log('professoreeeee');
                    this.teacher$.next(resp.body);
                } else if (resp.headers.get('X-User-Type') === 'admin') {
                    console.log('I\'m Admin');
                }
                this.storage.set('typeUser', resp.headers.get('X-User-Type')).then();
                this.loggedIn$.next(true);
                this.bob2();
                console.log('setto loggedIn nello storage e in loggedIn$');
                return resp.body;
            }));
    }

    async bob2() {
        await this.storage.set('loggedIn', true);
    }

    async logout() {
        this.authToken = null;
        this.loggedIn$.next(false);
        await this.storage.remove(AUTH_TOKEN);
        await this.storage.remove(UTENTE_STORAGE);
        await this.storage.set('loggedIn', false);
    }

    getStudent(): BehaviorSubject<Student> {
        return this.student$;
    }

    getTeacher(): BehaviorSubject<Teacher> {
        return this.teacher$;
    }

    getAuthToken(): string {
        return this.authToken;
    }

    isLogged(): Observable<boolean> {
        return this.loggedIn$.asObservable();
    }

    async whichUserType(): Promise<string> {
        await this.storage.get('typeUser').then((tipo) => {
            this.type = tipo;
        });
        return this.type;
    }
}
