import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {URL, LINGUA, STORAGE} from '../constants';
import {ChatMessage} from '../model/old/chat-message.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Message} from '../model/message.model';
import {CreatesChat} from '../model/creates.model';
import {create} from 'domain';
import {first, map} from 'rxjs/operators';
import {Planning} from '../model/planning.model';
import {Booking} from '../model/booking.model';
import {Chat} from '../model/chat.model';


export const userAvatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';

// export interface ChatList {
//     creates: CreatesChat;
//     messages: Message;
// }

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
    // NON SERVE PERO' LO TENGO
    getMessageId(): number {
        return this.messaggio.messageId;
    }
    // QUA VANNO SOLO LE CHIAMATE ALLO STORAGE ed OBSERVABLE
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

    /*
    * Questa funzione che si occupa della Query Rest della lista delle chat
    * e del seguente salvataggio degli oggetti 'first' Message[] e CreateChat[] nello storage
    * ritorna una lista di tipo any formata da
    * un oggetto di tipo 'first' Message[] in posizione [0]
    * e da un oggetto di tipo CreatesChat[] in posizione [1]
    */
    getRestChatList(): Observable<any[]> {
        return this.http.get<any[]>(URL.CHATLIST, {observe: 'response'}).pipe(
            map((resp: HttpResponse<any[]>) => {
                this.storage.set(STORAGE.CHATLIST, resp.body[0]);
                this.storage.set(STORAGE.CREATES, resp.body[1]);
                return resp.body;
            }));
    }

    getRestCountChat(): Observable<number> {
        return this.http.get(URL.CHAT_COUNT, {observe: 'response'}).pipe(
            map((resp: HttpResponse<number>) => {
                return resp.body;
            })
        );
    }

    getStorageChatList(): Observable<Message[]> {
        return fromPromise(this.storage.get(STORAGE.CHATLIST));
    }

    setSTorageChatList(firstMessages: Message[]) {
        this.storage.set(STORAGE.CHATLIST, firstMessages);
    }

    addMultiStorageChat(firstMessages: Message[]) {
        this.getStorageChatList().subscribe((chatList => {
            if (chatList) {
                const messages: Message[] = chatList;
                messages.concat(firstMessages);
                this.storage.set(STORAGE.CHATLIST, messages);
            } else {
                const messages: Message[] = [];
                messages.concat(firstMessages);
                this.storage.set(STORAGE.CHATLIST, messages);
            }
        }));
    }

    addOneStorageChat(firstMessage: Message) {
        this.getStorageChatList().subscribe((chatList => {
            if (chatList) {
                const messages: Message[] = chatList;
                messages.push(firstMessage);
                this.storage.set(STORAGE.CHATLIST, messages);
            } else {
                const messages: Message[] = [];
                messages.push(firstMessage);
                this.storage.set(STORAGE.CHATLIST, messages);
            }
        }));
    }

}

