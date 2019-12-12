export class User {

    email: string;
    roles: number;
    password: string;
    name: string;
    surname: string;
    birthday: Date;     // da verificare tipo
    language: boolean;
    image: string;

    constructor(obj: any) {
        this.email = obj.email;
        this.roles = obj.roles;
        this.password = obj.password;
        this.name = obj.name;
        this.surname = obj.surname;
        this.birthday = obj.birthday;
        this.language = obj.language;
        this.image = obj.image;
    }
}
