import {Chat} from './chat.model';
import {Teacher} from './teacher.model';
import {Student} from './student.model';
import {User} from './user.model';

export class CreatesChat {
    idCreates: number;
    userListser: User[];
    chat: Chat;

    constructor(idCreates: number, student: Student, teacher: Teacher, chat: Chat) {
        if (idCreates !== undefined) {
            this.idCreates = idCreates;
        } else {
            this.idCreates = 0;
        }
        if (student !== undefined && teacher !== undefined) {
            this.userListser = [student, teacher];
        } else if (student !== undefined) {
            this.userListser = [student, new Teacher(undefined)];
        } else if (teacher !== undefined) {
            this.userListser = [new Student(undefined), teacher];
        } else {
            this.userListser = [new Student(undefined), new Teacher(undefined)];
        }
        if (chat !== undefined) {
            this.chat = chat;
        } else {
            this.chat = new Chat(undefined);
        }
    }

    set(idCreates: number, student: Student, teacher: Teacher, chat: Chat) {
        if (idCreates !== undefined) {
            this.idCreates = idCreates;
        }
        if (student !== undefined && teacher !== undefined) {
            this.userListser = [student, teacher];
        } else if (student !== undefined) {
            this.userListser = [student, new Teacher(undefined)];
        } else if (teacher !== undefined) {
            this.userListser = [new Student(undefined), teacher];
        }
        if (chat !== undefined) {
            this.chat = chat;
        }
    }
}
