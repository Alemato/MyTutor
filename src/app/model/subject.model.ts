export class Subject {
    idSubject: number;
    macroSubject: string;
    microSubject: string;

    set(obj: any) {
        this.idSubject = obj.idSubject;
        this.macroSubject = obj.macroSubject;
        this.microSubject = obj.microSubject;
    }

    constructor() {
        this.idSubject = 0;
        this.macroSubject = '';
        this.microSubject = '';
    }
}
