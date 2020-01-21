import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {CreatesChat} from '../model/creates.model';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {STORAGE} from '../constants';

@Injectable({
    providedIn: 'root'
})
export class CreateService {

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
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
