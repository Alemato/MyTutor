export class User {

    idUser: number;
    email: string;
    roles: number;
    password: string;
    name: string;
    surname: string;
    birthday: Date;     // da verificare tipo
    language: boolean;
    image: string;

    set(obj: any) {
        this.idUser = obj.idUser;
        this.email = obj.email;
        this.roles = obj.roles;
        this.password = obj.password;
        this.name = obj.name;
        this.surname = obj.surname;
        this.birthday = obj.birthday;
        this.language = obj.language;
        this.image = obj.image;
    }

    constructor() {
        this.idUser = 0;
        this.email = '';
        this.roles = 0;
        this.password = '';
        this.name = '';
        this.surname = '';
        this.birthday = new Date();
        this.language = false;
        this.image = '';
    }
}
