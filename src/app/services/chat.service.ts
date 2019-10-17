import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {LINGUA} from '../constants';

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
}

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
  constructor(private storage: Storage) { }
  // inserire metodi per prendere i messaggi dallo storage;
  // getMessageId(): Observable<string> {
  // return fromPromise(this.storage.get());
  // }
  getMessageId(): string {
    return this.messaggio.messageId;
  }
  setMessageId(messageeeId: string) {
    this.messaggio.messageId = messageeeId;
  }
  getUserId(): string {
    return this.messaggio.userId;
  }
  getUserName(): string {
    return this.messaggio.userName;
  }
  getUserAvatar(): string {
   return this.messaggio.userAvatar;
  }
  getToUserId(): string {
    return this.messaggio.toUserId;
  }
  getTime(): number | string {
    return this.messaggio.time;
  }
  getMessage(): string {
    return this.messaggio.message;
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
