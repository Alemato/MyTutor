import {User} from '../user.model';

export interface Conversazione {
    idChat: number;
    chatName: string;
    users: User[];
    messaggeId: number;
    sendDate: Date;
    text: string;
}

export class Chat {
    idChat: number;
    chatName: string;
    users: User[];
    messaggeId: number;
    sendDate: Date;
    text: string;

    // constructor(chat: any) {
    //     this.idChat = chat.chat.idChat;
    //     this.chatName = chat.chat.name;
    //     // this.user = new User(chat.user);
    //     for (const ute of chat.user) {
    //         this.users.push(ute);
    //     }
    //     this.messaggeId = chat.messaggeId;
    //     this.sendDate = new Date(chat.sendDate);
    //     this.text = chat.text;
    // }
}
