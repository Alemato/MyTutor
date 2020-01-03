import {Chat} from './chat.model';
import {Teacher} from './teacher.model';
import {Student} from './student.model';

export class CreatesChat {
    idCreates: number;
    name: string;
    userListser: object[];
    chat: Chat;

    constructor() {
        this.idCreates = 0;
        this.userListser = [new Student(), new Teacher()];
        this.chat = new Chat();
    }

    set(obj: any, student: Student, teacher: Teacher, chat: Chat) {
        this.idCreates = obj.idCreates;
        this.userListser = [student, teacher];
        this.chat = chat;
    }
}
