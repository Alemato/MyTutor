import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {LINGUA} from '../constants';
import {ChatMessage} from '../model/chat.model';



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

    constructor(private storage: Storage) {
    }

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

    getUserId(): string {
        return this.messaggio.userId;
    }
    setuserId(userId: string) {
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

    getToUserId(): string {
        return this.messaggio.toUserId;
    }
    setUserId(toUserId: string) {
        this.messaggio.toUserId = toUserId;
    }

    getTime(): number | string {
        return this.messaggio.time;
    }

    getMessage(): string {
        return this.messaggio.message;
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
}
    // fuonzione che si prende in input l'oggetto messaggio, lo salva e lo caccia
