import { Injectable } from '@angular/core';
import {ChatMessage} from '../model/chat-message.model';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {URL} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ChatrestService {
  messaggio: ChatMessage;
  constructor(
      private storage: Storage,
      private http: HttpClient
  ) { }
  // QUA VANNO SOLO LE CHIAMATE REST
  // PRENDE DAL SERVER
  getMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(URL.CHATMESSAGE); // CHATMESSAGE
  }
  // INVIO AL SERVER UNA COSA APPENA CREATA
  postMessage(unmessaggio: ChatMessage) {
    this.http.post<ChatMessage>(URL.CHATMESSAGE, unmessaggio);
  }
}
