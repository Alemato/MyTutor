import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {Lezione} from '../../model/lezione.model';

@Component({
    selector: 'app-inserimento-lezioni-modal',
    templateUrl: './inserimento-lezioni-modal.page.html',
    styleUrls: ['./inserimento-lezioni-modal.page.scss'],
})

export class InserimentoLezioniModalPage implements OnInit {
    public dataLezioneFormModel: FormGroup;
    public lezione1: Lezione;
    public listaDataOraIF: FormArray;

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
    }

    // remove contact from group
    rimuoviCampo(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.listaDataOraIF.removeAt(index);
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
