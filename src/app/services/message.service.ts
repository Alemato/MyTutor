import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {STORAGE, URL} from '../constants';
import {BehaviorSubject, interval, Observable, Subscription} from 'rxjs';
import {Message} from '../model/message.model';
import {map} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private messages$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([] as Message[]);
    private periodicGet: Subscription;

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
    }

    /**
     * Funzione che ritorna il behaviorSubjcet dei messaggi della singola chat
     * faccio sempre una get se non ho i messaggi nello storage inizialmente
     * e faccio la get se il numero dei messaggi nello storage è diverso
     * da quello che ho sul server.
     * (faccio 2 get una per il numero dei messaggi sul server, una per la lista dei messaggi).
     */
    getBehaviorMessages(idChat: number): BehaviorSubject<Message[]> {
        if (this.ifEmpty(idChat)) {
            console.log('si è vuoto');
            this.getRestMessageOfChat(idChat).subscribe(() => {
            });
            return this.messages$;
        } else {
            console.log('no, non è vuoto');
            this.getStorageMessagesOfChat(idChat);
            if (this.getCountMessageFromStorage(idChat) === this.getRestCountMessage(idChat)) {
                return this.messages$;
            } else {
                // fare last message
                this.getLastMessageOfChat(idChat, this.messages$.value[this.messages$.value.length - 1].idMessage).subscribe(() => {
                });
                // this.getRestMessageOfChat(idChat);
                return this.messages$;
            }
        }
    }

    /**
     * funzione che effettua la get per l'intera lista di messaggi della singola chat
     * @param idChat id della chat
     */
    getRestMessageOfChat(idChat: number): Observable<Message[]> {
        // tslint:disable-next-line:max-line-length
        return this.http.get<Message[]>(URL.MESSAGE_OF_CHAT_PT_1 + idChat.toString() + URL.MESSAGE_OF_CHAT_PT_2, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Message[]>) => {
                this.addMultipleStorageMessageOfChat(resp.body, idChat);
                return resp.body;
            })
        );
    }

    /**
     * Funzione che effettua la get dei ultimi messaggi inviati e l'aggiornamento dello storage
     * con i nuovi messaggi.
     * @param idChat id della chat
     * @param idLastMessage id del ultimo messaggio salvato nello storage
     */
    getLastMessageOfChat(idChat: number, idLastMessage: number): Observable<Message[]> {
        const url = URL.MESSAGE_OF_CHAT_PT_1 + idChat.toString() + URL.MESSAGE_OF_CHAT_PT_2 + URL.LAST_MESSAGES;
        return this.http.get<Message[]>(url, {
            observe: 'response',
            params: {'id-last-message': idLastMessage.toString()}
        })
            .pipe(map((resp: HttpResponse<Message[]>) => {
                this.addNewMessaggesOfChat(resp.body, idChat);
                console.log(resp.body);
                return resp.body;
            }));
    }

    createRestMessage(message: Message): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.http.post<any>(URL.MESSAGE_OF_CHAT_PT_1 + message.chat.idChat.toString() + URL.MESSAGE_OF_CHAT_PT_2, message, {observe: 'response'});
    }

    /**
     * Funzione che verifica la presenza di messaggi nello storage per singola chat
     * @param idChat id della chat
     */
    ifEmpty(idChat: number): Observable<boolean> {
        return fromPromise(this.storage.get(STORAGE.MESSAGE).then((messages: Map<string, Message[]>) => {
            if (messages) {
                return !messages.get(idChat.toString());
            } else {
                return true;
            }
        }));
    }

    /**
     * Funzoine che effettua al get per vedere quanti messaggi sono presenti nel server
     * @param idChat id della chat
     */
    getRestCountMessage(idChat: number): Observable<number> {
        const url = URL.MESSAGE_OF_CHAT_PT_1 + idChat.toString() + URL.MESSAGE_OF_CHAT_PT_2 + URL.MESSAGE_COUNT;
        return this.http.get(url, {observe: 'response'}).pipe(
            map((resp: HttpResponse<number>) => {
                return resp.body;
            })
        );
    }

    /**
     * Funzione che conta quanti messaggi sono presenti nello storage per la singola chat
     * @param idChat id della chat
     */
    getCountMessageFromStorage(idChat: number): Observable<number> {
        return fromPromise(this.storage.get(STORAGE.MESSAGE).then((messages: Map<string, Message[]>) => {
            if (messages) {
                return messages.get(idChat.toString()).length;
            } else {
                return 0;
            }
        }));
    }

    /**
     * Funzione che torna la lista dei messagi della singola chat dallo storage
     * @param idChat id della chat
     */
    getStorageMessagesOfChat(idChat: number) {
        this.storage.get(STORAGE.MESSAGE).then((messages: Map<string, Message[]>) => {
            if (messages) {
                console.log(138);
                this.messages$.next(messages.get(idChat.toString()));
            }
        });
    }

    /**
     * funzione che ritorna una mappa di tutti i messaggi di tutte le chat
     * presenti nello storage
     */
    getStorageMessages(): Observable<Map<string, Message[]>> {
        return fromPromise(this.storage.get(STORAGE.MESSAGE));
    }

    /**
     * Funzione che salva i numovi messaggi nello storage
     * @param messages lista dei nuovi messaggi da salvare
     * @param idChat id della chat di appartenenza
     */
    addNewMessaggesOfChat(messages: Message[], idChat: number) {
        if (messages.length > 0) {
            this.getStorageMessages().subscribe((messageList: Map<string, Message[]>) => {
                if (messageList) {
                    console.log(messageList);
                    if (messageList.has(idChat.toString())) {
                        const oldMessages: Message[] = messageList.get(idChat.toString());
                        const newMessageAr: Message[] = [];
                        messages.forEach((message) => {
                            if (!oldMessages.some(x => x.idMessage === message.idMessage)) {
                                newMessageAr.push(message);
                            }
                        });
                        const newMessage = oldMessages.concat(newMessageAr.reverse());
                        const mex: Map<string, Message[]> = messageList;
                        console.log(171);
                        this.messages$.next(newMessage);
                        mex.set(messages[0].chat.idChat.toString(), newMessage);
                        this.storage.set(STORAGE.MESSAGE, mex);
                    }
                } else {
                    console.log(177);
                    this.messages$.next(messages.reverse());
                    const mex: Map<string, Message[]> = new Map<string, Message[]>();
                    mex.set(idChat.toString(), messages);
                    this.storage.set(STORAGE.MESSAGE, mex);
                }
            });
        }
    }

    /**
     * Funzione che salva i messaggi nello storage
     * Si differenzia dalla funzione precedente per il fatto che controlla l'esistenza della chat
     * nella mappa dello storage e se non esiste la crea.
     * @param messages lista messaggi da savare
     * @param idChat id della chat
     */
    addMultipleStorageMessageOfChat(messages: Message[], idChat: number) {
        this.getStorageMessages().subscribe((messageList: Map<string, Message[]>) => {
            if (messageList) {
                if (messageList.has(idChat.toString())) {
                    console.log(198);
                    this.messages$.next(messages.reverse());
                    console.log(messages);
                    const messageChatX: Message[] = messageList.get(idChat.toString());
                    messageChatX.concat(messages);
                    const mex: Map<string, Message[]> = messageList;
                    mex.set(idChat.toString(), messageChatX);
                    this.storage.set(STORAGE.MESSAGE, mex);
                } else {
                    console.log(207);
                    this.messages$.next(messages.reverse());
                    console.log(this.messages$.value);
                    const mex: Map<string, Message[]> = messageList;
                    mex.set(idChat.toString(), messages);
                    this.storage.set(STORAGE.MESSAGE, mex);
                }
            } else {
                console.log(215);
                this.messages$.next(messages.reverse());
                const mex = new Map<string, Message[]>();
                mex.set(idChat.toString(), messages);
                this.storage.set(STORAGE.MESSAGE, mex);
            }
        });
    }

    /**
     * Funzione che avvia un aggiornamento continuo della chat.
     * @param idChat id della chat
     */
    startPeriodicGetMessageForChat(idChat: number) {
        console.log('startPeriodicGetMessageForChat');
        // controllo se è inizializzato
        if (this.periodicGet !== undefined) {
            // controllo se è chiuso
            if (this.periodicGet.closed) {
                this.openPeriodicGet(idChat);
            } else {
                // chiudo e apro l'intervallo
                this.periodicGet.unsubscribe();
                this.openPeriodicGet(idChat);
            }
        } else {
            this.openPeriodicGet(idChat);
        }
    }

    /**
     * Funzione che contiene la logica dell'aggiornamento
     */
    openPeriodicGet(idChat: number) {
        this.periodicGet = interval(10000).subscribe(() => {
            if (this.messages$.value.length > 0) {
                console.log('startPeriodicGet');
                this.getLastMessageOfChat(idChat, this.messages$.value[this.messages$.value.length - 1].idMessage).subscribe(() => {
                });
            }
        });
    }

    /**
     * Funzione che ferma l'aggiornamento automantico.
     */
    stopPeriodicGetMessageForChat() {
        console.log('stopPeriodicGetMessageForChat');
        if (!this.periodicGet.closed) {
            this.periodicGet.unsubscribe();
        }
    }

    /**
     * Funzione che resetta le variabili al logout.
     */
    logout() {
        this.storage.remove(STORAGE.MESSAGE);
        this.messages$ = new BehaviorSubject<Message[]>([] as Message[]);
    }

}
