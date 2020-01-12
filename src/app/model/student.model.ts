import {User} from './user.model';

export class Student extends User {
    studyGrade: string;

    constructor(obj: any) {
        super(obj);
        if (obj !== undefined) {
            if (obj.studyGrade !== undefined) {
                this.studyGrade = obj.studyGrade;
            } else {
                this.studyGrade = '';
            }
        } else {
            this.studyGrade = '';
        }
    }

    set(obj: any) {
        super.set(obj);
        if (obj.studyGrade !== undefined) {
            this.studyGrade = obj.studyGrade;
        }
    }
}
