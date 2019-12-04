import {FormControl} from '@angular/forms';

export class RegisterEmailValidator {
    static emailIsValid(form: FormControl) {

        if (form.value === 'mario@mario.it') {
            return {
                validEmail: true
            };
        } else {
            return null;
        }
    }
}
