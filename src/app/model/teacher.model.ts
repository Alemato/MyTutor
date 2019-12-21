import {User} from './user.model';

export class Teacher {
    user: User = new User();
    postCode: number;
    city: string;
    region: string;
    street: string;
    streetNumber: string;
    byography: string;

    set(obj: any, user: User) {
        this.user.set(user);
        this.postCode = obj.postCode;
        this.city = obj.city;
        this.region = obj.region;
        this.street = obj.street;
        this.streetNumber = obj.streetNumber;
        this.byography = obj.byography;
    }

    constructor() {
        this.user = new User();
        this.postCode = 0;
        this.city = '';
        this.region = '';
        this.street = '';
        this.streetNumber = '';
        this.byography = '';
    }
}
