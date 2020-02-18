import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Teacher} from '../../model/teacher.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-registrazione-docente-modal',
    templateUrl: './registrazione-docente-modal.page.html',
    styleUrls: ['./registrazione-docente-modal.page.scss'],
})

export class RegistrazioneDocenteModalPage implements OnInit {
    private registrazioneModelDocente: FormGroup;
    private teacher: Teacher;

    validationMessages = {
        postCode: [
            {type: 'required', message: 'Zip Code is required'},
            {type: 'patten', message: 'invalid field, enter only numbers'}
        ],
        region: [
            {type: 'required', message: 'Region is required'}
        ],
        city: [
            {type: 'required', message: 'City is required'}
        ],
        street: [
            {type: 'required', message: 'Street is required'}
        ],
        streetNumber: [
            {type: 'required', message: 'Street Number is required'}
        ]
    };

    constructor(
        private modalController: ModalController,
        public formBuilder: FormBuilder,
        private navParams: NavParams,
        public translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.teacher = this.navParams.data.teacher;
        this.registrazioneModelDocente = this.formBuilder.group({
            postCode: [this.setPostCode(), Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]{5}')
            ])],
            region: [this.teacher.region, Validators.required],
            city: [this.teacher.city, Validators.required],
            street: [this.teacher.street, Validators.required],
            streetNumber: [this.teacher.streetNumber, Validators.required],
            byography: [this.teacher.byography]
        });
    }

    /**
     * Funzione per la chiusura del modal e invio dati del modal
     */
    async closeModal() {
        this.teacher.postCode = this.registrazioneModelDocente.value.postCode;
        this.teacher.region = this.registrazioneModelDocente.value.region;
        this.teacher.city = this.registrazioneModelDocente.value.city;
        this.teacher.street = this.registrazioneModelDocente.value.street;
        this.teacher.streetNumber = this.registrazioneModelDocente.value.streetNumber;
        this.teacher.byography = this.registrazioneModelDocente.value.byography;
        await this.modalController.dismiss([this.teacher, true]);
    }

    /**
     * Funzione che setta a default il poste code nel form
     */
    setPostCode() {
        if (this.teacher.postCode !== 0) {
            return this.teacher.postCode;
        } else {
            return '';
        }
    }

    /**
     * Funzione di traduzione
     */
    private initTranslate() {
        this.translateService.get('POST_CODE_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.postCode[0].message = data;
        });
        this.translateService.get('POST_CODE_PATTERN_MESSAGE').subscribe((data) => {
            this.validationMessages.postCode[1].message = data;
        });
        this.translateService.get('REGION_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.region[0].message = data;
        });
        this.translateService.get('CITY_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.city[0].message = data;
        });
        this.translateService.get('STREET_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.street[0].message = data;
        });
        this.translateService.get('STREET_NUMBER_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.streetNumber[0].message = data;
        });
    }

}
