export class ChatMessage {
    messageId: number;
    userId: number;
    userName: string;
    userAvatar: string;
    toUserId: number;
    time: number | string;
    message: string;
    status: string;
    ultimoTimeStamp: Date;  // forse aggiorno la pagina con lo storage invece che con il server
}
