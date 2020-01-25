import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {Lezione} from '../../model/old/lezione.model';

@Component({
    selector: 'app-inserimento-lezioni-modal',
    templateUrl: './inserimento-lezioni-modal.page.html',
    styleUrls: ['./inserimento-lezioni-modal.page.scss'],
})

export class InserimentoLezioniModalPage implements OnInit {
    public dataLezioneFormModel: FormGroup;
    public listaDataOraIF: FormArray;
    public arrayDymension = 1;
    minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

    // returns all form groups under contacts
    // prende l'oggetto
    get dataOraIFFormGroup() {
        return this.dataLezioneFormModel.get('dataOraIF') as FormArray;
    }

    constructor(
        public formBuilder: FormBuilder,
        public modalController: ModalController,
    ) {
    }

    ngOnInit() {
        this.dataLezioneFormModel = this.formBuilder.group({
            dataOraIF: this.formBuilder.array([this.creaDataOraIF()])
        });
        // set contactlist to this field
        this.listaDataOraIF = this.dataLezioneFormModel.get('dataOraIF') as FormArray;
    }

    changeInizioLezione(index) {
        this.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        this.hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        // this.dataLezioneFormModel.get('dataOraIF').get(index)
        // this.dataLezioneFormModel.get('dataOraIF').value.controls.oraFine.reset();
        // @ts-ignore
        console.log(this.dataLezioneFormModel.get('dataOraIF').controls[index].controls.oraFine.reset());
        console.log('cambio o setto orario lezione');
        // @ts-ignore
        const oraInizio = new Date(this.dataLezioneFormModel.get('dataOraIF').controls[index].controls.oraInizio.value);
        console.log(oraInizio);
        let i;
        let e = 0;
        for (i = 0; i < this.hours.length; i++) {
            if (this.hours[i] < oraInizio.getHours()) {
                e++;
            }
        }
        this.hours = this.hours.slice(e + 1, this.hours.length);
        e = 0;
        for (i = 0; i < this.minutes.length; i++) {
            if (this.minutes[i] < oraInizio.getMinutes()) {
                e++;
            }
        }
        this.minutes = this.minutes.slice(e, this.minutes.length);
    }

    // contact formgroup
    creaDataOraIF(): FormGroup {
        return this.formBuilder.group({
            dataLezione: ['', Validators.required],
            oraInizio: ['', Validators.required],
            oraFine: ['', Validators.required],
        });
    }

    // add a contact form group
    aggiungiCampo() {
        this.listaDataOraIF.push(this.creaDataOraIF());
        // @ts-ignore
        this.arrayDymension = this.dataLezioneFormModel.get('dataOraIF').length;
    }

    // remove contact from group
    rimuoviCampo(index) {
        // @ts-ignore
        if (this.dataLezioneFormModel.get('dataOraIF').length > 1) {
            this.listaDataOraIF.removeAt(index);
        }
        // @ts-ignore
        this.arrayDymension = this.dataLezioneFormModel.get('dataOraIF').length;
    }

    async chiudiModale() {
        // this.lezione1 = this.dataLezioneFormModel.value;
        await this.modalController.dismiss([this.dataLezioneFormModel.value, true]);
    }
    // method triggered when form is submitted
    submit() {
        console.log(this.dataLezioneFormModel.value);
    }

    // questi campi serviranno in futuro
    // triggered to change validation of value field type
    // changedFieldType(index) {
    //     let validators = null;
    //
    //     if (this.getContactsFormGroup(index).controls['type'].value === 'email') {
    //         validators = Validators.compose([Validators.required, Validators.email]);
    //     } else {
    //         validators = Validators.compose([
    //             Validators.required,
    //             Validators.pattern(new RegExp('^\\+[0-9]?()[0-9](\\d[0-9]{9})$')) // pattern for validating international phone number
    //         ]);
    //     }
    //
    //     this.getContactsFormGroup(index).controls['value'].setValidators(
    //         validators
    //     );
    //
    //     this.getContactsFormGroup(index).controls['value'].updateValueAndValidity();
    // }
    //
    // // get the formgroup under contacts form array
    // getContactsFormGroup(index): FormGroup {
    //     // this.contactList = this.form.get('contacts') as FormArray;
    //     const formGroup = this.contactList.controls[index] as FormGroup;
    //     return formGroup;
    // }
}
