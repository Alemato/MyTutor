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
        this.countDowns = interval(800).subscribe(() => {
            this.runCountDown();
        });
    }

    stopCoundown() {
        if (!this.countDowns.closed) {
            this.countDowns.unsubscribe();
        }
    }

    runCountDown() {
        this.listaLezioni.forEach((item, index) => {
            const nowDate = new Date().getTime();
            const distance = item.date - nowDate;
            item.days = Math.floor(distance / (1000 * 60 * 60 * 24));
            item.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            item.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            item.seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (item.days < 0 || item.hours < 0 || item.minutes < 0 || item.seconds < 0) {
                this.listaLezioni.splice(index, 1);
                const oldbook = this.bookings$.value.find(x => x.idBooking === item.idbook);
                oldbook.lessonState = 4;
                this.modifyRestLessonState(oldbook).subscribe();
            }
        });
        this.setBehaviorSubjectLezioni();
    }

    startPeriodicGet() {
        console.log('startPeriodicGet');
        this.periodicGet = interval(15000).subscribe(() => {
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
