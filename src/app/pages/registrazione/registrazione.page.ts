import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ModalController, NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Utente} from '../../model/utente.model';
import {RegistrazioneService} from '../../services/registrazione.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {RegistrazioneDocenteModalPage} from '../registrazione-docente-modal/registrazione-docente-modal.page';

@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.page.html',
    styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {
    private registrazioneFormModel: FormGroup;
    passwordType = 'password';
    passwordShow = false;

    constructor(
        public formBuilder: FormBuilder,
        // public utente: Utente,
        private storage: Storage,
        public registrazioneService: RegistrazioneService,
        private modal: ModalController
    ) {
    }

// vuole tutti i campi perchè si deve aspettare qualcosa
    ngOnInit() {
        this.registrazioneFormModel = this.formBuilder.group({
            // le cose che scrivo dentro [] le ritrovo sulla page registrazione.html
            nome: [''],
            cognome: [''],
            email: [''],
            password: [''],
            datanascita: [],
            regione: [''],
            citta: [''],
            cap: [],
            via: [''],
            civico: [],
            biografia: ['']
        });
    }

    public togglePassword() {
        if (this.passwordShow) {
            this.passwordShow = false;
            this.passwordType = 'password';
        } else {
            this.passwordShow = true;
            this.passwordType = 'text';
        }
    }

    async notify(event) {
        console.log(event.checked);
        if (event.checked) {
            const myModal = await this.modal.create({
                component: RegistrazioneDocenteModalPage
            });
            // await myModal.onDidDismiss((data => {
            //     console.log(data)
            // }))
            myModal.onDidDismiss().then((dataReturned) => {
                console.log('i dati sono:');
                console.log(dataReturned.data);
            });
            await myModal.present();
        }
    }

    prendiRegistrazione() {
        const utente: Utente = this.registrazioneFormModel.value;
        this.registrazioneService.setStoreRegistrazione('ute', utente);
        this.registrazioneService.postRegistrazione(utente).subscribe((prendeMessaggi) => {
            console.log(prendeMessaggi);
        });
        // this.registrazioneService.getRegistrazione()
        // console.log(JSON.stringify(utente));
        // console.log(this.registrazioneFormModel.value);
        // console.log(utente1);
    }
}
