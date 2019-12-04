import {FormControl} from '@angular/forms';

export class RegisterBirthdayValidator {
    static isAdult(form: FormControl) {
        const data1 = new Date(Date.parse(form.value));
        const timeDiff = Math.abs(Date.now() - data1.getTime());
        const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        if ( age < 18) {
            console.log(age);
            return {
            validAge: true
        };
        } else {
            return null;
        }
    }

}
