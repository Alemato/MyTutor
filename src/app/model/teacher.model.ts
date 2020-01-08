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
        if (obj.postCode) {this.postCode = obj.postCode; }
        if (obj.city) {this.city = obj.city; }
        if (obj.region) {this.region = obj.region; }
        if (obj.street) {this.street = obj.street; }
        if (obj.streetNumber) {this.streetNumber = obj.streetNumber; }
        if (obj.byography) {this.byography = obj.byography; }
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
