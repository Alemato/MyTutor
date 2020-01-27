import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Teacher} from '../../model/teacher.model';
import {User} from '../../model/user.model';
import { TranslateService } from '@ngx-translate/core';

export interface UserTeacher {
    postCode: number;
    city: string;
    region: string;
    street: string;
    streetNumber: string;
    byography: string;
}


@Component({
    selector: 'app-registrazione-docente-modal',
    templateUrl: './registrazione-docente-modal.page.html',
    styleUrls: ['./registrazione-docente-modal.page.scss'],
})

export class RegistrazioneDocenteModalPage implements OnInit {
    private registrazioneModelDocente: FormGroup;
    private interfaceTeacher: UserTeacher;
    private teacher: Teacher;
    private postCodeRequiredMessage: string;
    private postCodePatternMessage: string;
    private regionRequiredMessage: string;
    private cityRequiredMessage: string;
    private streetRequiredMessage: string;
    private streetNumberRequiredMessage: string;

    validationMessages = {
        postCode: [
            {type: 'required', message: this.postCodeRequiredMessage},
            {type: 'patten', message: this.postCodePatternMessage}
        ],
        region: [
            {type: 'required', message: this.regionRequiredMessage}
        ],
        city: [
            {type: 'required', message: this.cityRequiredMessage}
        ],
        street: [
            {type: 'required', message: this.streetRequiredMessage}
        ],
        streetNumber: [
            {type: 'required', message: this.streetNumberRequiredMessage}
        ]
    };

    @Input() utente1: User;

    constructor(
        private modalController: ModalController,
        public formBuilder: FormBuilder,
        navParams: NavParams,
        public translateService: TranslateService) {
        this.teacher = new Teacher(undefined);
        console.log(navParams.get('utente1'));
        console.log(this.teacher);
        this.teacher.set(navParams.get('utente1'));
        console.log(this.teacher);
        if (navParams.get('teacher1') == null || typeof navParams.get('teacher1') === 'undefined') {
            console.log('indefinito');
        } else {
            console.log('teacher 1');
            console.log(navParams.get('teacher1'));
            this.teacher.set(navParams.get('teacher1'));
        }
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
        this.teacher.setRegistrazione(this.registrazioneModelDocente.value);
        await this.modalController.dismiss([this.teacher, true]);
    }

    private initTranslate() {
        this.translateService.get('POST_CODE_REQUIRED_MESSAGE').subscribe((data) => {
            this.postCodeRequiredMessage = data;
        });
        this.translateService.get('POST_CODE_PATTERN_MESSAGE').subscribe((data) => {
            this.postCodePatternMessage = data;
        });
        this.translateService.get('REGION_REQUIRED_MESSAGE').subscribe((data) => {
            this.regionRequiredMessage = data;
        });
        this.translateService.get('CITY_REQUIRED_MESSAGE').subscribe((data) => {
            this.cityRequiredMessage = data;
        });
        this.translateService.get('STREET_REQUIRED_MESSAGE').subscribe((data) => {
            this.streetRequiredMessage = data;
        });
        this.translateService.get('STREET_NUMBER_REQUIRED_MESSAGE').subscribe((data) => {
            this.streetNumberRequiredMessage = data;
        });
    }

}
