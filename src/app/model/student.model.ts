import {User} from './user.model';

export  class Student {
    user: User;
    studyGrade: string;
    constructor(obj: any) {
        this.user = new User(obj.user);
        this.studyGrade = obj.studyGrade;
    }
}
