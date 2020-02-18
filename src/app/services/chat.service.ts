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
    private lastMessageFromChats$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([] as Message[]);
    private chat$: BehaviorSubject<Chat> = new BehaviorSubject<Chat>({} as Chat);
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
    }

    /**
     * Questa funzione che si occupa della Query Rest della lista delle chat
     * e del seguente salvataggio degli oggetti 'first' Message[] e CreateChat[] nello storage
     * ritorna una lista di tipo any formata da
     * un oggetto di tipo 'first' Message[] in posizione [0]
     * e da un oggetto di tipo CreatesChat[] in posizione [1]
     * @return Observable<any[]>
     */
    getRestChatList(): Observable<any[]> {
        return this.http.get<any[]>(URL.CHATLIST, {observe: 'response'}).pipe(
            map((resp: HttpResponse<any[]>) => {
                this.storage.set(STORAGE.CHATLIST, resp.body);
                this.lastMessageFromChats$.next(resp.body);
                return resp.body;
            }));
    }

    /**
     * Funzione che esegue la rest che ritona il numero di chat disponibili del utente
     * viene usato per vedere se ci cono nuove chat disponibili
     */
    getRestCountChat(): Observable<number> {
        return this.http.get(URL.CHAT_COUNT, {observe: 'response'}).pipe(
            map((resp: HttpResponse<number>) => {
                this.chatCount$.next(resp.body);
                return resp.body;
            })
        );
    }

    /**
     * Funzione che ritona il numero di chat attive con un determinato user
     * serve per vedere se esiste una chat con quel user
     * @param idUser id del altro user
     */
    getRestCountChatUser2(idUser: number): Observable<number> {
        return this.http.get(URL.CHAT_COUNT, {observe: 'response', params: {'id-user2': idUser.toString()}}).pipe(
            map((resp: HttpResponse<number>) => {
                return resp.body;
            })
        );
    }

    createRestChat(chat: Chat): Observable<string> {
        return this.http.post<string>(URL.CHAT_CREATE, chat, {observe: 'response'}).pipe(
            map((resp: HttpResponse<string>) => {
                return resp.headers.get('Location');
            })
        );

    }

    getRestChatByUrl(url: string): Observable<Chat> {
        return this.http.get<Chat>(url, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Chat>) => {
                this.chat$.next(resp.body);
                return resp.body;
            })
        );
    }

    /**
     * Ritona la lista dei ultimi messaggi,
     * nei messaggi abbiamo la chat e la lista di user che interagiscono in essa
     */
    getLastMessageFromChats(): BehaviorSubject<Message[]> {
        return this.lastMessageFromChats$;
    }

    /**
     * Ritona il numero di chat attive per utente
     */
    getChatCount(): BehaviorSubject<number> {
        return this.chatCount$;
    }

    /**
     * Funzione che ritona il numero delle chat salvate nello storage,
     * Quindi quelle che sappiamo essere attive Solo sul dispositivo
     * Serve per sapere quante chat sono nel dispositivo contro il numero
     * di chat sul server.
     */
    async countFromStorage(): Promise<number> {
        return this.storage.get(STORAGE.CHATLIST).then((item: Message[]) => {
            if (item) {
                return item.length;
            } else {
                return 0;
            }
        });
    }

    /**
     * funzione che ritona solo l'oggetto chat (da eliminare) da un specifico id
     * @param id della chat che si vuole
     */
    getCurrentChat(id: number): Observable<Chat> {
        return fromPromise(this.storage.get(STORAGE.CHATLIST).then((item: Message[]) => {
            console.log(item);
            if (item) {
                const mes = item.find(x => x.chat.idChat === id);
                return mes.chat;
            }
        }));
    }

    /**
     * AGGIORNAMENTO AUTOMATICO DELLE CHAT OGNI 1 MIN
     * vede se ci sono nuove chat disponbili sul server
     */
    startPeriodicGetCountChat() {
        console.log('startPeriodicGetCountChat');
        // controllo se è inizializzato
        if (this.periodicGet !== undefined) {
            // controllo se è stato chiuso
            if (this.periodicGet.closed) {
                this.openPeriodoGet();
            }
        } else {
            this.openPeriodoGet();
        }
    }

    /**
     * Funzione che contiene la logica dell'aggiornamento
     */
    openPeriodoGet() {
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

    /**
     * STOP DELL AGGIORNAMENTO DELLE CHAT
     */
    stopPeriodicGetCountChat() {
        console.log('stopPeriodicGet');
        if (!this.periodicGet.closed) {
            this.periodicGet.unsubscribe();
        }
    }

    getChat(): BehaviorSubject<Chat> {
        return this.chat$;
    }

    /**
     * Funzione di reset per il logout
     */
    logout() {
        this.storage.remove(STORAGE.CREATES);
        this.storage.remove(STORAGE.CHATLIST);
        this.lastMessageFromChats$ = new BehaviorSubject<Message[]>([] as Message[]);
        this.chatCount$ = new BehaviorSubject<number>(0);
        this.countChat = 0;
        this.stopPeriodicGetCountChat();
    }

}

