import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Student} from '../model/student.model';
import {Teacher} from '../model/teacher.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {AUTH_TOKEN, LINGUA, STORAGE, URL, UTENTE_STORAGE, X_AUTH} from '../constants';
import {map} from 'rxjs/operators';
import {sha512} from 'js-sha512';
import {ChatService} from './chat.service';
import {BookingService} from "./booking.service";

export interface Account {
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public authToken: string;
    public loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public user$: BehaviorSubject<any> = new BehaviorSubject<any>({} as any);
    public userType: string;
    public exist: boolean;

    constructor(private http: HttpClient,
                private storage: Storage,
                private bookingService: BookingService,
                private chatService: ChatService) {
        this.storage.get(AUTH_TOKEN).then((token) => {
            this.authToken = token;
            console.log('this.authToken');
            console.log(this.authToken);
            if (token !== null && token !== undefined && token !== '') {
                console.log('token dallo storage construck');
                console.log(token);
                this.loggedIn$.next(true);
            }
        });
        this.storage.get(UTENTE_STORAGE).then((utente) => {
            console.log('utente');
            console.log(utente);
            if (utente !== null && utente !== undefined && utente !== '') {
                if (utente.roles === 1) {
                    this.userType = 'student';
                    this.user$.next(utente);
                } else if (utente.roles === 2) {
                    this.userType = 'teacher';
                    this.user$.next(utente);
                }
            }
        });
        console.log('costruttore service');
    }

    getProfiloEmail(emailProfilo: string, saveUser: boolean): Observable<any> {
        return this.http.get<any>(URL.GET_PROFILO, {observe: 'response', params: {email: emailProfilo}}).pipe(
            map ( (resp: HttpResponse<any>) => {
                if (saveUser) {
                    this.storage.set(UTENTE_STORAGE, resp.body);
                    this.user$.next(resp.body);
                }
                return resp.body;
            }));
    }

    editProfiloTeacher(teacher: Teacher, password: string): Observable<any> {
        const pwdHash = sha512(password).toUpperCase();
        return this.http.put(URL.PUT_PROFILO_TEACHER, teacher, {observe: 'response', params: {hspwd: pwdHash}}).pipe(
            map( (resp: HttpResponse<any>) => {
                return resp;
            } ));
    }

    editProfiloStudent(student: Student, password: string): Observable<any> {
        const pwdHash = sha512(password).toUpperCase();
        return this.http.put(URL.PUT_PROFILO_STUDENT, student, {observe: 'response', params: {hspwd: pwdHash}}).pipe(
            map( (resp: HttpResponse<any>) => {
                return resp.body;
            } ));
    }

    login(account: Account): Observable<any> {
        return this.http.post<any>(URL.LOGIN, account, {observe: 'response'}).pipe(
            map((resp: HttpResponse<any>) => {
                const token = resp.headers.get(X_AUTH);
                console.log('token dal server');
                console.log(token);
                this.storage.set(AUTH_TOKEN, token);
                this.authToken = token;
                this.storage.set(UTENTE_STORAGE, resp.body);
                this.user$.next(resp.body);
                if (resp.body.language) {
                    this.storage.set(LINGUA, 'en');
                }
                this.storage.set('typeUser', resp.headers.get('X-User-Type')).then();
                this.userType = resp.headers.get('X-User-Type');
                this.loggedIn$.next(true);
                console.log('setto loggedIn in loggedIn$');
                console.log(resp);
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

    neodimio() {
        this.storage.set('loggedIn', false);
        this.storage.remove('typeUser');
        this.storage.remove(UTENTE_STORAGE);
        this.storage.remove(AUTH_TOKEN);
        this.storage.remove(STORAGE.LESSON);
        this.userType = null;
        this.authToken = null;
        this.user$ = new BehaviorSubject<any>({} as any);
        this.bookingService.logout();
        this.chatService.logout();
    }

    logout() {
        this.authToken = null;
        this.loggedIn$.next(false);
        this.neodimio();
    }

    getTypeUser(): string {
        return this.userType;
    }

    getUser(): BehaviorSubject<any> {
        return this.user$;
    }

    getToken(): string {
        return this.authToken;
    }

    isLogged(): Observable<boolean> {
        return this.loggedIn$.asObservable();
    }
}
