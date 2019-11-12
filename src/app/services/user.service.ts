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
    private typeUser$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private utente$: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);
    private student$: BehaviorSubject<Student> = new BehaviorSubject<Student>({} as Student);
    private teacher$: BehaviorSubject<Teacher> = new BehaviorSubject<Teacher>({} as Teacher);
    constructor(private http: HttpClient, private storage: Storage) {

        this.storage.get(AUTH_TOKEN).then((token) => {
            console.log(token);
            this.authToken = token;
            if (token !== null && token !== undefined && token !== '') {
                this.loggedIn$.next(true);
            }
        });
        this.storage.get(UTENTE_STORAGE).then((utente) => {
            this.utente$.next(utente);
        });

    }
    login(account: Account): Observable<any> {
        return this.http.post<any>(URL.LOGIN, account, {observe: 'response'}).pipe(
            map((resp: HttpResponse<any>) => {
                const token = resp.headers.get(X_AUTH);
                this.storage.set(AUTH_TOKEN, token);
                this.authToken = token;
                if (resp.headers.get('User-Type') === 'student') {
                    console.log('studenteeee');
                    this.student$.next(resp.body);
                    this.typeUser$.next('student');
                } else if (resp.headers.get('User-Type') === 'teacher') {
                    console.log('professoreeeee');
                    this.teacher$.next(resp.body);
                    this.typeUser$.next('teacher');
                } else if (resp.headers.get('User-Type') === 'admin') {
                    console.log('I\'m Admin');
                    this.typeUser$.next('admin');
                }
                this.loggedIn$.next(true);
                return resp.body;
            }));
    }

    logout() {
        this.authToken = null;
        this.loggedIn$.next(true);
        this.storage.remove(AUTH_TOKEN);
        this.storage.remove(UTENTE_STORAGE);

        // Nessuna chiamata al server perche' JWT e' stateless quindi non prevede alcun logout.
        // Per gestirlo si dovrebbe fare lato server una blacklist.
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
    whichUserType(): string {
        let type: string;
        this.typeUser$.asObservable().subscribe((tipo) => {
            type = tipo;
        });
        return type;
    }
}
