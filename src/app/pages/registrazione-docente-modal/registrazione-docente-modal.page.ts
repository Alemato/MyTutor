import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Teacher} from '../../model/teacher.model';
import {User} from '../../model/user.model';
import { TranslateService } from '@ngx-translate/core';
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

    @Input() utente1: User;

    constructor(
        private modalController: ModalController,
        public formBuilder: FormBuilder,
        navParams: NavParams,
        public translateService: TranslateService) {
        /*this.teacher = new Teacher(undefined);
        this.teacher.set(navParams.get('utente1'));
        if (navParams.get('teacher1') == null || typeof navParams.get('teacher1') === 'undefined') {
            console.log('indefinito');
        } else {
            this.teacher.set(navParams.get('teacher1'));
        }*/
    }

    ngOnInit() {
        this.initTranslate();
        this.registrazioneModelDocente = this.formBuilder.group({
            postCode: [this.teacher.postCode, Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]{5}')
                // Validators.maxLength(5)
                //
            ])],
            region: [this.teacher.region, Validators.required],
            city: [this.teacher.city, Validators.required],
            street: [this.teacher.street, Validators.required],
            streetNumber: [this.teacher.streetNumber, Validators.required],
            byography: [this.teacher.byography]
        });
    }

    async closeModal() {
       // this.teacher.setRegistrazione(this.registrazioneModelDocente.value);
        await this.modalController.dismiss([this.teacher, true]);
    }

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
