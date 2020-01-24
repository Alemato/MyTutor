import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CreatesChat} from '../model/creates.model';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {STORAGE, URL} from '../constants';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CreateService {

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
    }

    getListCreates(idUser: number): Observable<CreatesChat[]> {
        return this.http.get(URL.CHAT_CREATES, {observe: 'response', params:{idUser2: idUser.toString()}})
            .pipe( map((resp: HttpResponse<CreatesChat[]>) => {
            return resp.body;
        }));
    }

    getStorageCreateList(): Observable<CreatesChat[]> {
        return fromPromise(this.storage.get(STORAGE.CREATES));
    }

    setStorageCreates(creates: CreatesChat[]) {
        this.storage.set(STORAGE.CREATES, creates);
    }

    addMultiStorageCreate(createsList: CreatesChat[]) {
        this.getStorageCreateList().subscribe((createList) => {
            if (createList) {
                const creates: CreatesChat[] = createList;
                creates.concat(createsList);
                this.storage.set(STORAGE.CREATES, creates);
            } else {
                const creates: CreatesChat[] = [];
                creates.concat(createsList);
                this.storage.set(STORAGE.CREATES, creates);
            }
        });
    }

    addOneStorageCreate(create: CreatesChat) {
        this.getStorageCreateList().subscribe((createList) => {
            if (createList) {
                const creates: CreatesChat[] = createList;
                creates.push(create);
                this.storage.set(STORAGE.CREATES, creates);
            } else {
                const creates: CreatesChat[] = [];
                creates.push(create);
                this.storage.set(STORAGE.CREATES, creates);
            }
        });
    }
}
