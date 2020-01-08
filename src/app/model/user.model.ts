export class User {
    idUser: number;
    email: string;
    roles: number;
    name: string;
    surname: string;
    birthday: number;
    language: boolean;
    image: string;

    set(obj: any) {
        if (obj.idUser) {this.idUser = obj.idUser; }
        if (obj.email) {this.email = obj.email; }
        if (obj.roles) {this.roles = obj.roles; }
        if (obj.name) {this.name = obj.name; }
        if (obj.surname) {this.surname = obj.surname; }
        if (obj.birthday) {this.birthday = obj.birthday; }
        if (obj.language) {this.language = obj.language; }
        if (obj.image) {this.image = obj.image; }
    }

    constructor() {
        this.idUser = 0;
        this.email = '';
        this.roles = 0;
        this.name = '';
        this.surname = '';
        this.birthday = new Date().getTime();
        this.language = false;
        this.image = '';
    }

    public numberRules(): number {
        if (this.language) {
            return 1;
        } else { return 0; }
    }

    public setRules(n: number) {
        if (n === 0) {
            this.language = false;
        } else { this.language = true; }
    }
}
