
export interface Messaggi {
    text: string;
    sendDate: Date;
    chat: {idChat: number, chatName: string};
    users: {idUser: number}[];
}

export class Message {
idMessage: number;
text: string;
sendDate: Date;
chat: {idChat: number, chatName: string};
users: {idUser: number, name: string, surname: string}[] = [];

    // public constructor(message: Message) {
    //     this.idMessage = message.idMessage;
    //     this.text = message.text;
    //     this.sendDate = new Date(message.sendDate.toLocaleDateString());
    //     this.chat.idChat = message.chat.idChat;
    //     this.chat.chatName = message.chat.chatName;
    //     for (const user of message.users) {
    //         let useAppo: { idUser: number; name: string; surname: string };
    //         useAppo = {idUser: user.idUser, name: user.name, surname: user.surname};
    //         this.users.push(useAppo);
    //     }
    // }
}
