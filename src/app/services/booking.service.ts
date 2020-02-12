import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, interval, Observable, Subscription} from 'rxjs';
import {Booking} from '../model/booking.model';
import {STORAGE, URL} from '../constants';
import {map} from 'rxjs/operators';
import {User} from '../model/user.model';

export interface Lez {
    idbook: number;
    idPlanning: number;
    lessonState: number;
    nomeLezione: string;
    price: number;
    nomeProf: string;
    emailProf: string;
    imgProf: string;
    nomeStudent: string;
    emailStudent: string;
    imgStudent: string;
    date: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private bookings$: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([] as Booking[]);
    private listLez$: BehaviorSubject<Lez[]> = new BehaviorSubject<Lez[]>([] as Lez[]);
    private countDowns: Subscription;
    private periodicGet: Subscription;
    private listaLezioni: Lez[];

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
        this.listaLezioni = [];
        this.storage.get(STORAGE.BOOKING).then((data) => {
            if (data !== null && data !== undefined && data !== {}) {
                this.bookings$.next(data);
            }
        });
    }

    /**
     * Funzione che effettua la rest che ritorna tutti i booking dell'utente, e li salva nello storage
     * ritorna la lista di tutti i booking
     * @return Observable<Booking[]>
     */
    getRestBooking(): Observable<Booking[]> {
        return this.http.get<Booking[]>(URL.BOOKING_HOME, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Booking[]>) => {
                this.setStoreBookings(STORAGE.BOOKING, resp.body);
                this.bookings$.next(resp.body);
                return resp.body;
            }));
    }

    /**
     * Funzione che eseguel la rest che ritorna la lista di user che ci sono nei booking
     * ritorna la lista degli user
     * servirà per popolare la select user per il filtro dello storico
     * @return Observable<User[]>
     */
    getRestUsersBooking(): Observable<User[]> {
        return this.http.get<Booking[]>(URL.BOOKING_HOME, {observe: 'response'}).pipe(map((resp: HttpResponse<Booking[]>) => {
            const listUser: User[] = [];
            resp.body.forEach((item) => {
                const indexUserTeacher = listUser.findIndex(i => i === item.planning.lesson.teacher);
                if (indexUserTeacher === -1) {
                    listUser.push(item.planning.lesson.teacher);
                }
                const indexUserStudent = listUser.findIndex( i => i === item.student);
                if (indexUserStudent === -1) {
                    listUser.push(item.student);
                }
            });
            return listUser;
        }));
    }

    /**
     * Funzione che effetua la rest per il filtro dello storico dei booking
     * ritorna lista di booking filtrata
     * @param macroMateria la macro materia (es. Matematica, Italiano)
     * @param microMateria la sottomateria (es. Equazioni, Divina Commedia)
     * @param nomeLezione il nome della lezione
     * @param dataLezione la data della prenotazione
     * @param utente l'user con i quale è stata fatta (lista di teacher per gli student e viceversa)
     * @param statoLezione lo stato della singola lezione
     *       (0 = Prenotata, 1 = Accettata, 2 = Rifiutata, 3 = Annullata, 4 = Eseguita)
     * @return Observable<Booking[]>
     */
    // tslint:disable-next-line:max-line-length
    getRestHistoricalBookingFilter(macroMateria: string, microMateria: string, nomeLezione: string, dataLezione: string, utente: string, statoLezione: string): Observable<Booking[]> {
        return this.http.get<Booking[]>(URL.BOOKING_HISTORY, {
            observe: 'response',
            params: {
                'macro-materia': macroMateria,
                'nome-lezione': nomeLezione, 'micro-materia': microMateria, data: dataLezione,
                'id-utente': utente, stato: statoLezione
            }
        }).pipe(map((resp: HttpResponse<Booking[]>) => {
            return resp.body;
        }));
    }

    createRestBooking(bookings: Booking[]): Observable<any> {
        return this.http.post<any>(URL.BOOKING, bookings, {observe: 'response'});
    }

    modifyRestLessonState(boking: Booking) {
        return this.http.put(URL.BOOKING_MODIFY_LESSON_STATE, boking);
    }

    setStoreBookings(key: string, bookings: Booking[]) {
        this.storage.set(key, bookings);
    }

    getBookings(): BehaviorSubject<Booking[]> {
        return this.bookings$;
    }

    getListaLezioni(): BehaviorSubject<Lez[]> {
        return this.listLez$;
    }

    setListaLezioni(listLez: Lez[]) {
        this.listaLezioni = listLez;
    }

    setBehaviorSubjectLezioni() {
        this.listLez$.next(this.listaLezioni);
    }

    startCoundown() {
        this.countDowns = interval(1000).subscribe(() => {
            this.runCountDown();
        });
    }

    stopCoundown() {
        if (!this.countDowns.closed) {
            this.countDowns.unsubscribe();
        }
    }

    runCountDown() {
        this.bookings$.value.forEach((item, index) => {
            const nowDate = new Date().getTime();
            const distance = new Date(item.planning.date).getTime() - nowDate;
            item.days = Math.floor(distance / (1000 * 60 * 60 * 24));
            item.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            item.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            item.seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (item.days < 0 || item.hours < 0 || item.minutes < 0 || item.seconds < 0) {
                this.listaLezioni.splice(index, 1);
                const oldbook = this.bookings$.value.find(x => x.idBooking === item.idBooking);
                oldbook.lessonState = 4;
                this.modifyRestLessonState(oldbook).subscribe(() => {});
            }
        });
        this.setBehaviorSubjectLezioni();
    }

    startPeriodicGet() {
        console.log('startPeriodicGet');
        // controllo se già ho un intervallo inizializzato
        if (this.periodicGet !== undefined) {
            // controllo se è chiuso cosi lo apro
            if (this.periodicGet.closed) {
                this.periodicGet = interval(15000).subscribe(() => {
                    console.log('startPeriodicGet');
                    this.getRestBooking().subscribe(() => {
                    });
                });
            }
        } else {
            this.periodicGet = interval(15000).subscribe(() => {
                console.log('startPeriodicGet');
                this.getRestBooking().subscribe(() => {
                });
            });
        }

    }

    stopPeriodicGet() {
        console.log('stopPeriodicGet');
        if (!this.periodicGet.closed) {
            this.periodicGet.unsubscribe();
        }
    }

    logout() {
        this.storage.remove(STORAGE.BOOKING);
        this.bookings$ = new BehaviorSubject<Booking[]>([] as Booking[]);
        this.listLez$ = new BehaviorSubject<Lez[]>([] as Lez[]);
        this.listaLezioni = [];
        // this.listUser = [new User(undefined)];
    }
}
