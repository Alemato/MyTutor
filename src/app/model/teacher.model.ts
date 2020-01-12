import {User} from './user.model';

export class Teacher extends User {
    idTeacher: number;
    postCode: number;
    city: string;
    region: string;
    street: string;
    streetNumber: string;
    byography: string;

    constructor(obj: any) {
        super(obj);
        if (obj !== undefined) {
            if (obj.idTeacher !== undefined) {
                this.idTeacher = obj.idTeacher;
            }
            if (obj.postCode !== undefined) {
                this.postCode = obj.postCode;
            }
            if (obj.city !== undefined) {
                this.city = obj.city;
            }
            if (obj.region !== undefined) {
                this.region = obj.region;
            }
            if (obj.street !== undefined) {
                this.street = obj.street;
            }
            if (obj.streetNumber !== undefined) {
                this.streetNumber = obj.streetNumber;
            }
            if (obj.byography !== undefined) {
                this.byography = obj.byography;
            }
        } else {
            this.postCode = 0;
            this.city = '';
            this.region = '';
            this.street = '';
            this.streetNumber = '';
            this.byography = '';
        }
    }

    set(obj: any) {
        super.set(obj);
        if (obj !== undefined) {
            if (obj.postCode !== undefined) {
                this.postCode = obj.postCode;
            }
            if (obj.city !== undefined) {
                this.city = obj.city;
            }
            if (obj.region !== undefined) {
                this.region = obj.region;
            }
            if (obj.street !== undefined) {
                this.street = obj.street;
            }
            if (obj.streetNumber !== undefined) {
                this.streetNumber = obj.streetNumber;
            }
            if (obj.byography !== undefined) {
                this.byography = obj.byography;
            }
        }
    }

    public setRegistrazione(obj: any) {
        if (obj !== undefined) {
            if (obj.postCode !== undefined) {
                this.postCode = obj.postCode;
            } else {
                this.postCode = 0;
            }
            if (obj.city !== undefined) {
                console.log(obj.city);
                this.city = obj.city;
            } else {
                this.city = '';
            }
            if (obj.region !== undefined) {
                console.log(obj.region);
                this.region = obj.region;
            } else {
                this.region = '';
            }
            if (obj.street !== undefined) {
                console.log(obj.street);
                this.street = obj.street;
            } else {
                this.street = '';
            }
            if (obj.streetNumber !== undefined) {
                console.log(obj.streetNumber);
                this.streetNumber = obj.streetNumber;
            } else {
                this.streetNumber = '';
            }
            if (obj.byography !== undefined) {
                console.log(obj.byography);
                this.byography = obj.byography;
            } else {
                this.byography = '';
            }
        } else {
            this.postCode = 0;
            this.city = '';
            this.region = '';
            this.street = '';
            this.streetNumber = '';
            this.byography = '';
        }
    }
}
