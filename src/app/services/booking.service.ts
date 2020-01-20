import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, interval, Observable, Subscription} from 'rxjs';
import {Booking} from '../model/booking.model';
import {STORAGE, URL} from '../constants';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {Planning} from '../model/planning.model';

export interface Lez {
    idbook: number;
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

    getRestBooking(): Observable<Booking[]> {
        return this.http.get<Booking[]>(URL.BOOKING_HOME, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Booking[]>) => {
                this.setStoreBookings(STORAGE.BOOKING, resp.body);
                this.bookings$.next(resp.body);
                return resp.body;
            }));
    }

    getRestBookingResearch(nomeUtente: string): Observable<Booking[]> {
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

    getRestHistoricalBookingFilter(): Observable<Booking[]> {
        return this.http.get<Booking[]>(URL.BOOKING_HISTORY_FILTER, {
            params: {
                'macro-materia': '1',
                'nome-lezione': '2', 'micro-materia': '3', data: '4',
                'id-utente': '5', stato: '6'
            }
        });
    }

    createRestBooking(bookings: Booking[]) {
        return this.http.post(URL.BOOKING, bookings);
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

    getStorageBookingById(idBooking: number, storageKey: string): Observable<Booking> {
        return fromPromise(this.storage.get(storageKey).then((bookings) => {
            console.log(bookings);
            return bookings.find(i => i.idBooking === idBooking);
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
        this.periodicGet = interval(12000).subscribe(x => {
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
}
