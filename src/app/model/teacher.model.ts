import {User} from './user.model';

export class Teacher {
    user: User;
    postCode: number;
    city: string;
    region: string;
    street: string;
    streetNumber: string;
    byography: string;

    constructor(obj: any) {
        this.user = new User(obj.user);
        this.postCode = obj.postCode;
        this.city = obj.city;
        this.region = obj.region;
        this.street = obj.street;
        this.streetNumber = obj.streetNumber;
        this.byography = obj.byography;
    }
}
