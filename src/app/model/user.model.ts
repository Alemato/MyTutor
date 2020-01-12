export class User {
    idUser: number;
    email: string;
    password: string;
    roles: number;
    name: string;
    surname: string;
    birthday: number;
    language: boolean;
    image: string;

    constructor(obj: any) {
        if (obj !== undefined) {
            if (obj.idUser !== undefined) {
                this.idUser = obj.idUser;
            }
            if (obj.email !== undefined) {
                this.email = obj.email;
            }
            if (obj.password !== undefined) {
                this.password = obj.password;
            }
            if (obj.roles !== undefined) {
                this.roles = obj.roles;
            }
            if (obj.name !== undefined) {
                this.name = obj.name;
            }
            if (obj.surname !== undefined) {
                this.surname = obj.surname;
            }
            if (obj.birthday !== undefined) {
                this.birthday = obj.birthday;
            }
            if (obj.language !== undefined) {
                this.language = obj.language;
            }
            if (obj.image !== undefined) {
                this.image = obj.image;
            }
        } else {
            this.idUser = 0;
            this.email = '';
            this.password = '';
            this.roles = 0;
            this.name = '';
            this.surname = '';
            this.birthday = new Date().getTime();
            this.language = false;
            this.image = '';
        }
    }

    set(obj: any) {
        if (obj !== undefined) {
            if (obj.idUser !== undefined) {
                this.idUser = obj.idUser;
            }
            if (obj.email !== undefined) {
                this.email = obj.email;
            }
            if (obj.password !== undefined) {
                this.password = obj.password;
            }
            if (obj.roles !== undefined) {
                this.roles = obj.roles;
            }
            if (obj.name !== undefined) {
                this.name = obj.name;
            }
            if (obj.surname !== undefined) {
                this.surname = obj.surname;
            }
            if (obj.birthday !== undefined) {
                this.birthday = obj.birthday;
            }
            if (obj.language !== undefined) {
                this.language = obj.language;
            }
            if (obj.image !== undefined) {
                this.image = obj.image;
            }
        }
    }


    public numberRules(): number {
        if (this.language) {
            return 1;
        } else {
            return 0;
        }
    }

    public setRules(n: number) {
        if (n === 0) {
            this.language = false;
        } else {
            this.language = true;
        }
    }
}
