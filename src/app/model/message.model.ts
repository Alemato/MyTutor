import {Chat} from './chat.model';
import {User} from './user.model';

export class Message {
    idMessage: number;
    text: string;
    sendDate: number;
    chat: Chat;
    user: User;

    constructor() {
        this.idMessage = 0;
        this.text = '';
        this.sendDate = new Date().getTime();
        this.chat = new Chat();
        this.user = new User();
    }

    set(obj: any) {
        this.idMessage = obj.idMessage ;
        this.text = obj.text;
        this.sendDate = obj.sendDate;
        this.chat = obj.chat;
        this.user = obj.user;
    }
}
