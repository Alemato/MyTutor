import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Student} from '../model/student.model';
import {Teacher} from '../model/teacher.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {AUTH_TOKEN, LINGUA, STORAGE, URL, UTENTE_STORAGE, X_AUTH} from '../constants';
import {map} from 'rxjs/operators';
import {sha512} from 'js-sha512';
import {BookingService} from './booking.service';
import {ChatService} from './chat.service';
import {LessonService} from './lesson.service';
import {MessageService} from './message.service';
import {PlanningService} from './planning.service';
import {SubjectService} from './subject.service';

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
                private chatService: ChatService,
                private lessonService: LessonService,
                private messageService: MessageService,
                private planningService: PlanningService,
                private subjectService: SubjectService) {
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
    }

    /**
     * Funzione che esegue la Rest per avere l'oggetto dell'utente da vedere, prende in input un id
     * @param idUser id del user
     */
    getProfilobyID(idUser: number): Observable<any> {
        return this.http.get<any>(URL.GET_PROFILO, {observe: 'response', params: {'id-user': idUser.toString()}}).pipe(
            map ( (resp: HttpResponse<any>) => {
                return resp.body;
            }));
    }

    /**
     * Funzione che esegue l'aggiornamento dei dati del Teacher
     * @param teacher oggetto modificato da inviare
     * @param password antecedente al cambiamento di essa (se non si chambia la pwd, è la stessa anche dopo)
     */
    editProfiloTeacher(teacher: Teacher, password: string): Observable<any> {
        const pwdHash = sha512(password).toUpperCase();
        return this.http.put(URL.PUT_PROFILO_TEACHER, teacher, {observe: 'response', params: {hspwd: pwdHash}}).pipe(
            map( (resp: HttpResponse<any>) => {
                return resp;
            } ));
    }

    /**
     * Funzione che esegue l'aggiornamento dei dati dello Student
     * @param student oggetto modificato da inviare
     * @param password antecedente al cambiamento di essa (se non si chambia la pwd, è la stessa anche dopo)
     */
    editProfiloStudent(student: Student, password: string): Observable<any> {
        const pwdHash = sha512(password).toUpperCase();
        return this.http.put(URL.PUT_PROFILO_STUDENT, student, {observe: 'response', params: {hspwd: pwdHash}}).pipe(
            map( (resp: HttpResponse<any>) => {
                return resp.body;
            } ));
    }

    /**
     * Funzione per l'esecuzione del login
     * @param account Interfaccia che ha solo email e password
     */
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
                } else {
                    this.storage.set(LINGUA, 'it');
                }
                this.storage.set('typeUser', resp.headers.get('X-User-Type')).then();
                this.userType = resp.headers.get('X-User-Type');
                this.loggedIn$.next(true);
                console.log('setto loggedIn in loggedIn$');
                console.log(resp);
                return resp.body;
            }));
    }

    /**
     * Funzione per cercare un oggetto salvato nello storage
     * tritorna una promise booleana con lo stato true se esiste e false se non esiste
     * @param value key nello storage
     */
    ifExistKey(value: string): Promise<boolean> {
        return this.storage.get(value).then(data => {
                return !!data;
            }
        );
    }

    /**
     * Funzione che setta nello storage, la variabile che ci dice se l'utente è loggato
     * @param value true per l'utete loggatto e false per l'utete non loggato
     */
    setLoggeIn(value: boolean) {
        this.storage.set('loggedIn', value);
    }

    /**
     * Funzione che resetta tutta l'appicazione, usata per il logout dell'utenza.
     */
    logout() {
        this.storage.set('loggedIn', false);
        this.storage.remove('typeUser');
        this.storage.remove(UTENTE_STORAGE);
        this.storage.remove(AUTH_TOKEN);
        this.storage.remove(STORAGE.LESSON);
        this.userType = null;
        this.authToken = null;
        this.loggedIn$.next(false);
        this.user$ = new BehaviorSubject<any>({} as any);
        this.bookingService.logout();
        this.chatService.logout();
        this.lessonService.logout();
        this.messageService.logout();
        this.planningService.logout();
        this.subjectService.logout();
    }

    /**
     * Funzione che restituisce il tipo dell'Utenza (Teacher o Student)
     */
    getTypeUser(): string {
        return this.userType;
    }

    /**
     * Funzione che restituisce il BehaviorSubject dell'oggetto dell'utenza (Teacher o Student)
     */
    getUser(): BehaviorSubject<any> {
        return this.user$;
    }

    /**
     * Funzione che restituisce il token per autenticare le richieste Rest
     */
    getToken(): string {
        return this.authToken;
    }

    /**
     * Funzione che ritorna Observable della variabile loggedIn che serve per vedere se l'utenza è loggata o meno
     */
    isLogged(): Observable<boolean> {
        return this.loggedIn$.asObservable();
    }
}
