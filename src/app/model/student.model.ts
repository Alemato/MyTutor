import {User} from './user.model';

export class Student extends User {
    idStudent: number;
    studyGrade: string;

    setStudentFromUser(user: User) {
        this.idUser = user.idUser;
        this.email = user.email;
        this.password = user.password;
        this.roles = user.roles;
        this.name = user.name;
        this.surname = user.surname;
        this.birthday = user.birthday;
        this.language = user.language;
        this.idStudent  = 0;
        this.studyGrade = '';
    }

}
