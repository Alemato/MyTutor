import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Teacher} from '../../model/teacher.model';
import {User} from '../../model/user.model';

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

    validationMessages = {
        postCode: [
            {type: 'required', message: 'campo richiesto'},
            {type: 'patten', message: 'campo non valido, inserire solo numeri'}
        ],
        region: [
            {type: 'required', message: 'campo richiesto'}
        ],
        city: [
            {type: 'required', message: 'campo richiesto'}
        ],
        street: [
            {type: 'required', message: 'campo richiesto'}
        ],
        streetNumber: [
            {type: 'required', message: 'campo richiesto'}
        ]
    };

    @Input() utente1: User;

    constructor(
        private modalController: ModalController,
        public formBuilder: FormBuilder,
        navParams: NavParams) {
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

}
