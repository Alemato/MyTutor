import {User} from './user.model';

export class Teacher extends User {
    idTeacher: number;
    postCode: number;
    city: string;
    region: string;
    street: string;
    streetNumber: string;
    byography: string;

    setTeacherFromUser(user: User): Teacher {
        this.idUser = user.idUser;
        this.email = user.email;
        this.password = user.password;
        this.roles = user.roles;
        this.name = user.name;
        this.surname = user.surname;
        this.birthday = user.birthday;
        this.language = user.language;
        this.idTeacher = 0;
        this.postCode = 0;
        this.city = '';
        this.region = '';
        this.street = '';
        this.streetNumber = '';
        this.byography = '';
        return this;
    }
}
