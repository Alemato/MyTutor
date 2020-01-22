import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {BehaviorSubject, interval, Observable, Subscription} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {URL, STORAGE, AUTH, AUTH_TOKEN} from '../constants';
import {ChatMessage} from '../model/old/chat-message.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Message} from '../model/message.model';
import {CreatesChat} from '../model/creates.model';
import {map} from 'rxjs/operators';


export const userAvatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';

// export interface ChatList {
//     creates: CreatesChat;
//     messages: Message;
// }

@Injectable({
    providedIn: 'root'
})

export class ChatService {
    private messaggio: ChatMessage;
    private creates$: BehaviorSubject<CreatesChat[]> = new BehaviorSubject<CreatesChat[]>([] as CreatesChat[]);
    private lastMessageFromChats$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([] as Message[]);
    private chatCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private countChat = 0;
    private periodicGet: Subscription;

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
        this.storage.get(STORAGE.CHATLIST).then((item: Message[]) => {
            if (item) {
                this.lastMessageFromChats$.next(item);
                this.chatCount$.next(item.length);
            }
        });
        this.storage.get(STORAGE.CREATES).then((item: CreatesChat[]) => {
            if (item) {
                this.creates$.next(item);
            }
        });
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
                this.lastMessageFromChats$.next(resp.body[0]);
                this.storage.set(STORAGE.CREATES, resp.body[1]);
                this.creates$.next(resp.body[1]);
                return resp.body;
            }));
    }

    getRestCountChat(): Observable<number> {
        return this.http.get(URL.CHAT_COUNT, {observe: 'response'}).pipe(
            map((resp: HttpResponse<number>) => {
                this.chatCount$.next(resp.body);
                return resp.body;
            })
        );
    }

    getLastMessageFromChats(): BehaviorSubject<Message[]> {
        return this.lastMessageFromChats$;
    }

    getCreates(): BehaviorSubject<CreatesChat[]> {
        return this.creates$;
    }

    getChatCount(): BehaviorSubject<number> {
        return this.chatCount$;
    }

    getStorageChatList(): Observable<Message[]> {
        return fromPromise(this.storage.get(STORAGE.CHATLIST));
    }

    async countFromStorage(): Promise<number> {
        return this.storage.get(STORAGE.CHATLIST).then((item: Message[]) => {
            if (item) {
                return item.length;
            } else {
                return 0;
            }
        });
    }

    getCountFromStorage(): number {
        return this.countChat;
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

    startPeriodicGetCountChat() {
        console.log('startPeriodicGetCountChat');
        this.periodicGet = interval(60000).subscribe(x => {
            this.storage.get(AUTH_TOKEN).then((tok) => {
                if (tok) {
                    this.getRestCountChat().subscribe((n: number) => {
                        if (n !== 0) {
                            this.countFromStorage().then((numb: number) => {
                                if (numb < n) {
                                    this.getRestChatList().subscribe(() => {
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    stopPeriodicGetCountChat() {
        console.log('stopPeriodicGet');
        if (!this.periodicGet.closed) {
            this.periodicGet.unsubscribe();
        }
    }

    logout() {
        this.storage.remove(STORAGE.CREATES);
        this.storage.remove(STORAGE.CHATLIST);
        this.messaggio = null;
        this.creates$ = new BehaviorSubject<CreatesChat[]>([] as CreatesChat[]);
        this.lastMessageFromChats$ = new BehaviorSubject<Message[]>([] as Message[]);
        this.chatCount$ = new BehaviorSubject<number>(0);
        this.countChat = 0;
        this.stopPeriodicGetCountChat();
    }

}

