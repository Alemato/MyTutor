import {User} from './user.model';

export  class Student {
    user: User = new User();
    studyGrade: string;

    set(studyGrade: string , user: User) {
        this.user.set(user);
        if (studyGrade) {this.studyGrade = studyGrade; }
    }

    constructor() {
        this.user = new User();
        this.studyGrade = '';
    }
}
