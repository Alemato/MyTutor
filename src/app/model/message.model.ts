import {Chat} from './chat.model';
import {User} from './user.model';

export class Message {
    idMessage: number;
    text: string;
    sendDate: number;
    chat: Chat;
    user: User;

}
