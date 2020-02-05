import {User} from './user.model';

export class Teacher extends User {
    idTeacher: number;
    postCode: number;
    city: string;
    region: string;
    street: string;
    streetNumber: string;
    byography: string;

}
