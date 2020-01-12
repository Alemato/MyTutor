export class Chat {
    idChat: number;
    chatName: string;

    constructor(obj: any) {
        if (obj !== undefined) {
            if (obj.idChat !== undefined) {
                this.idChat = obj.idChat;
            } else {
                this.idChat = 0;
            }
            if (obj.chatName !== undefined) {
                this.chatName = obj.chatName;
            } else {
                this.chatName = '';
            }
        } else {
            this.idChat = 0;
            this.chatName = '';
        }
    }

    set(obj: any) {
        if (obj !== undefined) {
            if (obj.idChat !== undefined) {
                this.idChat = obj.idChat;
            }
            if (obj.chatName !== undefined) {
                this.chatName = obj.chatName;
            }
        }
    }
}
