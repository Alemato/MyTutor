export class Chat {
    idChat: number;
    name: string;

    constructor(obj: any) {
        if (obj !== undefined) {
            if (obj.idChat !== undefined) {
                this.idChat = obj.idChat;
            } else {
                this.idChat = 0;
            }
            if (obj.chatName !== undefined) {
                this.name = obj.chatName;
            } else {
                this.name = '';
            }
        } else {
            this.idChat = 0;
            this.name = '';
        }
    }

    set(obj: any) {
        if (obj !== undefined) {
            if (obj.idChat !== undefined) {
                this.idChat = obj.idChat;
            }
            if (obj.chatName !== undefined) {
                this.name = obj.chatName;
            }
        }
    }
}
