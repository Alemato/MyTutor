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

    getBehaviorMessages(): BehaviorSubject<Message[]> {
        return this.messages$;
    }

    getRestMessageOfChat(idChat: number): Observable<Message[]> {
        // tslint:disable-next-line:max-line-length
        return this.http.get<Message[]>(URL.MESSAGE_OF_CHAT_PT_1 + idChat.toString() + URL.MESSAGE_OF_CHAT_PT_2, {observe: 'response'}).pipe(
            map((resp: HttpResponse<Message[]>) => {
                this.addMultipleStorageMessageOfChat(resp.body);
                return resp.body;
            })
        );
    }

    getLastMessageOfChat(idChat: number, idLastMessage: number): Observable<Message[]> {
        const url = URL.MESSAGE_OF_CHAT_PT_1 + idChat.toString() + URL.MESSAGE_OF_CHAT_PT_2 + URL.LAST_MESSAGES;
        return  this.http.get<Message[]>(url, {observe: 'response', params: {'id-last-message': idLastMessage.toString()}})
            .pipe( map((resp: HttpResponse<Message[]>) => {
                this.addNewMessaggesOfChat(resp.body);
                return resp.body;
        }));
    }

    createRestMessage(message: Message): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.http.post<any>(URL.MESSAGE_OF_CHAT_PT_1 + message.chat.idChat.toString() + URL.MESSAGE_OF_CHAT_PT_2, message, {observe: 'response'});
    }

    ifEmpty(idChat: number): Observable<boolean> {
        return fromPromise(this.storage.get(STORAGE.MESSAGE).then((messages: Map<string, Message[]>) => {
            if (messages) {
                return !messages.get(idChat.toString());
            } else {
                return true;
            }
        }));
    }

    getRestCountMessage(idChat: number): Observable<number> {
        const url = URL.MESSAGE_OF_CHAT_PT_1 + idChat.toString() + URL.MESSAGE_OF_CHAT_PT_2 + URL.MESSAGE_COUNT;
        return this.http.get(url, {observe: 'response'}).pipe(
            map((resp: HttpResponse<number>) => {
                return resp.body;
            })
        );
    }

    getCountMessageFromStorage(idChat: number): Observable<number> {
        return fromPromise(this.storage.get(STORAGE.MESSAGE).then((messages: Map<string, Message[]>) => {
            if (messages) {
                return messages.get(idChat.toString()).length;
            } else {
                return 0;
            }
        }));
    }

    getStorageMessagesOfChat(idChat: number) {
        this.storage.get(STORAGE.MESSAGE).then((messages: Map<string, Message[]>) => {
            this.messages$.next(messages.get(idChat.toString()));
        });
    }

    getStorageMessages(): Observable<Map<string, Message[]>> {
        return fromPromise(this.storage.get(STORAGE.MESSAGE));
    }

    addNewMessaggesOfChat(messages: Message[]) {
        this.getStorageMessages().subscribe((messageList: Map<string, Message[]>) => {
            if (messageList) {
                if (messageList.has(messages[0].chat.idChat.toString())) {
                    const oldMessages: Message[] = messageList.get(messages[0].chat.idChat.toString());
                    const newMessageAr: Message[] = [];
                    messages.forEach((message) => {
                        if (!oldMessages.some( x => x.idMessage === message.idMessage)) {
                            newMessageAr.push(message);
                        }
                    });
                    const newMessage = oldMessages.concat(newMessageAr.reverse());
                    const mex: Map<string, Message[]> = messageList;
                    this.messages$.next(newMessage);
                    mex.set(messages[0].chat.idChat.toString(), newMessage);
                    this.storage.set(STORAGE.MESSAGE, mex);
                }
            } else {
                const mex: Map<string, Message[]> = new Map<string, Message[]>();
                mex.set(messages[0].chat.idChat.toString(), messages);
                this.storage.set(STORAGE.MESSAGE, mex);
            }
        });
    }

    addMultipleStorageMessageOfChat(messages: Message[]) {
        this.getStorageMessages().subscribe((messageList: Map<string, Message[]>) => {
            if (messageList) {
                if (messageList.has(messages.find(x => x !== undefined).chat.idChat.toString())) {
                    this.messages$.next(messages);
                    const messageChatX: Message[] = messageList.get(messages.find(x => x !== undefined).chat.idChat.toString());
                    messageChatX.concat(messages);
                    const mex: Map<string, Message[]> = messageList;
                    mex.set(messages.find(x => x !== undefined).chat.idChat.toString(), messageChatX);
                    this.storage.set(STORAGE.MESSAGE, mex);
                    console.log('la if è vera');
                } else {
                    this.messages$.next(messages.reverse());
                    const mex: Map<string, Message[]> = messageList;
                    mex.set(messages.find(x => x !== undefined).chat.idChat.toString(), messages);
                    this.storage.set(STORAGE.MESSAGE, mex);
                    console.log('la if è falsa');
                }
            } else {
                this.messages$.next(messages.reverse());
                const mex = new Map<string, Message[]>();
                mex.set(messages[0].chat.idChat.toString(), messages);
                console.log(mex);
                this.storage.set(STORAGE.MESSAGE, mex);
            }
        });
    }

    startPeriodicGetMessageForChat(idChat: number) {
        console.log('startPeriodicGetMessageForChat');
        this.periodicGet = interval(10000).subscribe(() => {
            console.log('startPeriodicGet');
            this.getLastMessageOfChat(idChat, this.messages$.value[this.messages$.value.length - 1].idMessage).subscribe(() => {
            });
        });
    }

    stopPeriodicGetMessageForChat() {
        console.log('stopPeriodicGetMessageForChat');
        if (!this.periodicGet.closed) {
            this.periodicGet.unsubscribe();
        }
    }

    logout() {
        this.storage.remove(STORAGE.MESSAGE);
        this.messages$ = new BehaviorSubject<Message[]>([] as Message[]);
    }

}
