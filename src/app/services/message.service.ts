import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {STORAGE, URL} from '../constants';
import {Observable} from 'rxjs';
import {Message} from '../model/message.model';
import {map} from 'rxjs/operators';
import {Planning} from '../model/planning.model';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) {
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

    createRestMessage(message: Message) {
        this.http.post(URL.MESSAGE_OF_CHAT_PT_1 + message.chat.idChat.toString() + URL.MESSAGE_OF_CHAT_PT_2, message);
    }

    getRestCountMessage(): Observable<number> {
        return this.http.get(URL.MESSAGE_COUNT, {observe: 'response'}).pipe(
            map((resp: HttpResponse<number>) => {
                return resp.body;
            })
        );
    }

    getStorageMessagesOfChat(idChat: number): Observable<Message[]> {
        return fromPromise(this.storage.get(STORAGE.MESSAGE).then((messages: Map<string, Message[]>) => {
            return messages.get(idChat.toString());
        }));
    }

    getStorageMessages(): Observable<Map<string, Message[]>> {
        return fromPromise(this.storage.get(STORAGE.MESSAGE));
    }

    addStorageMessageOfChat(message: Message) {
        this.getStorageMessages().subscribe((messageList: Map<string, Message[]>) => {
            if (messageList.has(message.chat.idChat.toString())) {
                const messageChatX: Message[] = messageList.get(message.chat.idChat.toString());
                messageChatX.push(message);
                const mex: Map<string, Message[]> = messageList;
                mex.set(message.chat.idChat.toString(), messageChatX);
                this.storage.set(STORAGE.MESSAGE, mex);
            } else {
                const mex: Map<string, Message[]> = messageList;
                const messageChatX: Message[] = [];
                messageChatX.push(message);
                mex.set(message.chat.idChat.toString(), messageChatX);
                this.storage.set(STORAGE.MESSAGE, mex);
            }
        });
    }

    addMultipleStorageMessageOfChat(messages: Message[]) {
        this.getStorageMessages().subscribe((messageList: Map<string, Message[]>) => {
            if (messageList.has(messages.find(x => x !== undefined).chat.idChat.toString())) {
                const messageChatX: Message[] = messageList.get(messages.find(x => x !== undefined).chat.idChat.toString());
                messageChatX.concat(messages);
                const mex: Map<string, Message[]> = messageList;
                mex.set(messages.find(x => x !== undefined).chat.idChat.toString(), messageChatX);
                this.storage.set(STORAGE.MESSAGE, mex);
            } else {
                const mex: Map<string, Message[]> = messageList;
                mex.set(messages.find(x => x !== undefined).chat.idChat.toString(), messages);
                this.storage.set(STORAGE.MESSAGE, mex);
            }
        });
    }

}
