export class Chat {
    idChat: number;
    chatName: string;

    constructor() {
        this.idChat = 0;
        this.chatName = '';
    }

    set(obj: any) {
        this.idChat = obj.idChat;
        this.chatName = obj.chatName;
    }
}
