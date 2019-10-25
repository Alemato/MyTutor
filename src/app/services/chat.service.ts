import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {URL, LINGUA} from '../constants';
import {ChatMessage} from '../model/chat.model';
import {HttpClient} from '@angular/common/http';



export class UserInfo {
    id: string;
    name?: string;
    avatar?: string;
}

export const userAvatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';

@Injectable({
    providedIn: 'root'
})

export class ChatService {
    messaggio: ChatMessage;

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
    }
    // interoggazioni con il server devo utilizzare l'Oservable
    // inserire metodi per prendere i messaggi dallo storage;
    // getMessageId(): Observable<string> {
    // return fromPromise(this.storage.get());
    // }
    // NON SERVE LO TENGO
    getMessageId(): number {
        return this.messaggio.messageId;
    }
    // PRENDE DAL SERVER
    getMessages(): Observable<ChatMessage[]> {
       return this.http.get<ChatMessage[]>(URL.CHATMESSAGE); // CHATMESSAGE
    }
    // QUA VANNO SOLO LE CHIAMATE ALLO STORAGE ed OBSERVABLE
    // INVIO AL SERVER UNA COSA APPENA CREATA
    postMessage(unmessaggio: ChatMessage) {
        this.http.post<ChatMessage>(URL.CHATMESSAGE, unmessaggio);
    }
    // getMessaggio(): Observable<ChatMessage> {
    //   return fromPromise(this.storage.get('ll').get)
    // }
    getFromStorageId(chiave: string): Observable<ChatMessage> {
        return fromPromise(this.storage.get(chiave));
    }
    getFromStorageMex(chiave: string): Observable<Map<string, ChatMessage[]>> {
        return fromPromise(this.storage.get(chiave));
    }
    // metto nello storage
    setStoreMap(chiave: string, chatmap: Map<string, ChatMessage[]>) {
        this.storage.set(chiave, chatmap);
    }
}
    // fuonzione che si prende in input l'oggetto messaggio, lo salva e lo caccia
