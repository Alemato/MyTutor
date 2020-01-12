export class Subject {
    idSubject: number;
    macroSubject: string;
    microSubject: string;

    constructor(obj: any) {
        if (obj !== undefined) {
            if (obj.idSubject !== undefined) {
                this.idSubject = obj.idSubject;
            } else {
                this.idSubject = 0;
            }
            if (obj.macroSubject !== undefined) {
                this.macroSubject = obj.macroSubject;
            } else {
                this.macroSubject = '';
            }
            if (obj.microSubject !== undefined) {
                this.microSubject = obj.microSubject;
            } else {
                this.microSubject = '';
            }
        } else {
            this.idSubject = 0;
            this.macroSubject = '';
            this.microSubject = '';
        }
    }

    set(obj: any) {
        if (obj !== undefined) {
            if (obj.idSubject !== undefined) {
                this.idSubject = obj.idSubject;
            }
            if (obj.macroSubject !== undefined) {
                this.macroSubject = obj.macroSubject;
            }
            if (obj.microSubject !== undefined) {
                this.microSubject = obj.microSubject;
            }
        }
    }
}
