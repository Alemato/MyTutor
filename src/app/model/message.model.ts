import {Chat} from './chat.model';
import {User} from './user.model';

export class Message {
    idMessage: number;
    text: string;
    sendDate: Date;
    chat: Chat;
    user: User;

    constructor(obj: any, chat: Chat, user: User) {
        if (obj !== undefined) {
            if (obj.idMessage !== undefined) {
                this.idMessage = obj.idMessage;
            } else {
                this.idMessage = 0;
            }
            if (obj.text !== undefined) {
                this.text = obj.text;
            } else {
                this.text = '';
            }
            if (obj.sendDate !== undefined) {
                this.sendDate =  obj.sendDate;
            } else {
                this.sendDate = new Date();
            }
        } else {
            this.idMessage = 0;
            this.text = '';
            this.sendDate = new Date();
        }
        if (chat !== undefined) {
            this.chat = chat;
        } else {
            this.chat = new Chat(undefined);
        }
        if (user !== undefined) {
            this.user = user;
        } else {
            this.user = new User(undefined);
        }
    }

    set(obj: any, chat: Chat, user: User) {
        if (obj !== undefined) {
            if (obj.idMessage !== undefined) {
                this.idMessage = obj.idMessage;
            }
            if (obj.text !== undefined) {
                this.text = obj.text;
            }
            if (obj.sendDate !== undefined) {
                this.sendDate =  obj.sendDate;
            }
        }
        if (chat !== undefined) {
            this.chat = chat;
        }
        if (user !== undefined) {
            this.user = user;
        }
    }
}
