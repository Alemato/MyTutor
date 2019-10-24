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
    getMessageId(): number {
        return this.messaggio.messageId;
    }

    setMessageId(Id: number) {
        this.messaggio.messageId = Id;
    }

    getUserId(): number {
        return this.messaggio.userId;
    }
    setuserId(userId: number) {
        this.messaggio.userId = userId;
    }

    getUserName(): string {
        return this.messaggio.userName;
    }

    setUserName(userName: string) {
        this.messaggio.userName = userName;
    }

    getUserAvatar(): string {
        return this.messaggio.userAvatar;
    }

    getToUserId(): number {
        return this.messaggio.toUserId;
    }
    setUserId(toUserId: number) {
        this.messaggio.toUserId = toUserId;
    }

    getTime(): number | string {
        return this.messaggio.time;
    }
    // PRENDE DAL SERVER
    getMessages(): Observable<ChatMessage[]> {
       return this.http.get<ChatMessage[]>(URL.CHATMESSAGE); // CHATMESSAGE
    }

    // INVIO AL SERVER UNA COSA APPENA CREATA
    postMessage(unmessaggio: ChatMessage) {
        this.http.post<ChatMessage>(URL.CHATMESSAGE, unmessaggio);
    }

    setMessage(message: string) {
        this.messaggio.message = message;
    }

    getStatus(): string {
        return this.messaggio.status;
    }

    getMessaggio(): ChatMessage {
        return this.messaggio;
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
