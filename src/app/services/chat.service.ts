import { Injectable } from '@angular/core';

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}

export const userAvatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  constructor() { }
  // inserire metodi per prendere i messaggi dallo storage;
}
