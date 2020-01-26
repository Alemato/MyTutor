import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, interval, Observable, Subscription} from 'rxjs';
import {Booking} from '../model/booking.model';
import {STORAGE, URL} from '../constants';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {Planning} from '../model/planning.model';
import {User} from '../model/user.model';
import {compilerSetStylingMode} from '@angular/compiler/src/render3/view/styling_state';

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
    private listUser: User[] = [new User(undefined)];

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

    getRestBooking(): Observable<Booking[]> {
        return this.http.get<Booking[]>(URL.BOOKING_HOME, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Booking[]>) => {
                this.setStoreBookings(STORAGE.BOOKING, resp.body);
                this.bookings$.next(resp.body);
                return resp.body;
            }));
    }

    getRestUsersBooking(): Observable<User[]> {
        return this.http.get<Booking[]>(URL.BOOKING_HOME, {observe: 'response'}).pipe(map((resp: HttpResponse<Booking[]>) => {
            this.listUser.pop();
            resp.body.forEach((item) => {
                this.listUser.push(item.student);
                this.listUser.push(item.planning.lesson.teacher);
            });
            const newOb = [];
            for (let i = 0; i < this.listUser.length; i++) {
                let flag = false;
                for (let j = i + 1; j < this.listUser.length; j++) {
                    if (this.listUser[i].idUser === this.listUser[j].idUser) {
                        flag = false;
                        break;
                    } else {
                        flag = true;
                    }
                }
                if (flag) {
                    newOb.push(this.listUser[i]);
                }
            }
            newOb.push(this.listUser[this.listUser.length - 1]);
            return newOb;
        }));
    }

    getRestBookingResearch(macroSubject: string, lessonName: string, zona: string, microSubject: string, ): Observable<Booking[]> {
        return this.http.get<Booking[]>(URL.BOOKING_RESEARCH, {
            observe: 'response', params: {
                'macro-materia': '1',
                'nome-lezione': '2', zona: '3', 'micro-materia': '4', 'giorno-settimana': '5',
                prezzo: '6', 'ora-inizio': '7', 'ora-fine': '8'
            }
        }).pipe(
            map((resp: HttpResponse<Booking[]>) => {
                return resp.body;
            }));
    }

    getRestHistoricalBooking(): Observable<Booking[]> {
        return this.http.get<Booking[]>(URL.BOOKING_HISTORY, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Booking[]>) => {
                this.setStoreBookings(STORAGE.HISTORY, resp.body);
                return resp.body;
            }));
    }

    // tslint:disable-next-line:max-line-length
    getRestHistoricalBookingFilter(macroMateria: string, microMateria: string, nomeLezione: string, dataLezione: string, utente: string, statoLezione: string): Observable<Booking[]> {
        return this.http.get<Booking[]>(URL.BOOKING_HISTORY_FILTER, {
            observe: 'response',
            params: {
                'macro-materia': macroMateria,
                'nome-lezione': nomeLezione, 'micro-materia': microMateria, data: dataLezione,
                'id-utente': utente, stato: statoLezione
            }
        }).pipe(map((resp: HttpResponse<Booking[]>) => {
            this.bookings$.next(resp.body);
            return resp.body;
        }));
    }

    createRestBooking(bookings: Booking[]): Observable<any> {
        return this.http.post<any>(URL.BOOKING, bookings, {observe: 'response'});
    }

    modifyRestLessonState(boking: Booking) {
        // const url = `${}/${idBooking}`;
        return this.http.put(URL.BOOKING_MODIFY_LESSON_STATE, boking);
    }

    getRestCountBooking(): Observable<Booking[]> {
        return this.http.get<Booking[]>(URL.BOOKING_COUNT);
    }

    setStoreBookings(key: string, bookings: Booking[]) {
        this.storage.set(key, bookings);
    }

    getStorageBookings(key: string): Observable<Booking[]> {
        return fromPromise(this.storage.get(key));
    }

    removeStorageBooking(key: string) {
        this.storage.remove(key);
    }

    getStorageBookingById(idPlanning: number, storageKey: string): Observable<Booking> {
        return fromPromise(this.storage.get(storageKey).then((bookings) => {
            console.log(bookings);
            return bookings.find(i => i.planning.idPlanning === idPlanning);
        }));
    }

    addOneStorageBooking(booking: Booking) {
        this.getStorageBookings(STORAGE.BOOKING).subscribe((bookingList) => {
            if (bookingList) {
                const bookings: Booking[] = bookingList;
                bookings.push(booking);
                this.storage.set(STORAGE.BOOKING, bookings);
            } else {
                const bookings: Booking[] = [];
                bookings.push(booking);
                this.storage.set(STORAGE.BOOKING, bookings);
            }
        });
    }

    removeOneStorageBooking(booking: Booking) {
        this.getStorageBookings(STORAGE.BOOKING).subscribe((bookingList) => {
            const bookings: Booking[] = bookingList;
            bookings.splice(bookings.findIndex(i => i.idBooking === booking.idBooking), 1);
            this.storage.set(STORAGE.BOOKING, bookings);
        });
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
        this.countDowns = interval(800).subscribe(x => {
            this.runCountDown();
        });
    }

    stopCoundown() {
        if (!this.countDowns.closed) {
            this.countDowns.unsubscribe();
        }
    }

    runCountDown() {
        this.listaLezioni.forEach((item) => {
            const nowDate = new Date().getTime();
            const distance = item.date - nowDate;
            item.days = Math.floor(distance / (1000 * 60 * 60 * 24));
            item.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            item.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            item.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        });
        this.setBehaviorSubjectLezioni();
    }

    startPeriodicGet() {
        console.log('startPeriodicGet');
        this.periodicGet = interval(15000).subscribe(x => {
            console.log('startPeriodicGet');
            this.getRestBooking().subscribe(() => {
            });
        });
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
        this.listUser = [new User(undefined)];
    }
}
