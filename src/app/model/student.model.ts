import {User} from './user.model';

export class Student extends User {
    idStudent: number;
    studyGrade: string;

    constructor(obj: any) {
        super(obj);
        if (obj !== undefined) {
            if (obj.idStudent !== undefined) {
                this.idStudent = obj.idStudent;
            } else {
                this.idStudent = 0;
            }
            if (obj.studyGrade !== undefined) {
                this.studyGrade = obj.studyGrade;
            } else {
                this.studyGrade = '';
            }
        } else {
            this.idStudent = 0;
            this.studyGrade = '';
        }
    }

    set(obj: any) {
        super.set(obj);
        if (obj !== undefined) {
            if (obj.idStudent !== undefined) {
                this.idStudent = obj.idStudent;
            }
            if (obj.studyGrade !== undefined) {
                this.studyGrade = obj.studyGrade;
            }
        }
    }
}
