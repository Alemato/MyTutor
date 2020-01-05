import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Booking} from '../model/booking.model';
import {URL} from '../constants';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
      private storage: Storage,
      private http: HttpClient
  ) { }

  getRestBooking(): Observable<Booking[]> {
    return this.http.get<Booking[]>(URL.HOME_BOOKING);
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
}
