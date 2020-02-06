import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {BehaviorSubject, interval, Observable, Subscription} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {URL, STORAGE, AUTH_TOKEN} from '../constants';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Message} from '../model/message.model';
import {map} from 'rxjs/operators';
import {Chat} from '../model/chat.model';


@Injectable({
    providedIn: 'root'
})

export class ChatService {
   // private creates$: BehaviorSubject<CreatesChat[]> = new BehaviorSubject<CreatesChat[]>([] as CreatesChat[]);
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
        /*this.storage.get(STORAGE.CREATES).then((item: CreatesChat[]) => {
            if (item) {
                this.creates$.next(item);
            }
        });*/
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
                // this.creates$.next(resp.body[1]);
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

    getRestCountChatUser2(idUser: number): Observable<number> {
        return this.http.get(URL.CHAT_COUNT, {observe: 'response', params: {idUser2: idUser.toString()}}).pipe(
            map((resp: HttpResponse<number>) => {
                return resp.body;
            })
        );
    }

    getLastMessageFromChats(): BehaviorSubject<Message[]> {
        return this.lastMessageFromChats$;
    }

    /*getCreates(): BehaviorSubject<CreatesChat[]> {
        return this.creates$;
    }*/

    getChatCount(): BehaviorSubject<number> {
        return this.chatCount$;
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

    getCurrentChat(id: number): Observable<Chat> {
        return fromPromise(this.storage.get(STORAGE.CHATLIST).then((item: Message[]) => {
            console.log(item);
            if (item) {
                const mes = item.find(x => x.chat.idChat === id);
                return mes.chat;
            }
        }));
    }

    startPeriodicGetCountChat() {
        console.log('startPeriodicGetCountChat');
        this.periodicGet = interval(60000).subscribe(() => {
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
        // this.creates$ = new BehaviorSubject<CreatesChat[]>([] as CreatesChat[]);
        this.lastMessageFromChats$ = new BehaviorSubject<Message[]>([] as Message[]);
        this.chatCount$ = new BehaviorSubject<number>(0);
        this.countChat = 0;
        this.stopPeriodicGetCountChat();
    }

}

