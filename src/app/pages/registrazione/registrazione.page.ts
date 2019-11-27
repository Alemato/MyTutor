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
    public toogle = false;
    croppedImagepath = '';
    img = false;

    constructor(
        public formBuilder: FormBuilder,
        // public utente: Utente,
        private storage: Storage,
        public registrazioneService: RegistrazioneService,
        public modalController: ModalController
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

    public stampa() {
        console.log('stampa');
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
    async openModal() {
        const modal = await this.modalController.create({
            component: RegistrazioneDocenteModalPage
        });

        modal.onDidDismiss().then((dataReturned) => {
            /*if (dataReturned !== null) {
                this.dataReturned = dataReturned.data;
                //alert('Modal Sent Data :'+ dataReturned);
            }*/
            console.log('i dati sono: ' + dataReturned.data);
        });

        await modal.present();
    }

    notify() {
        if (this.toogle) {
            this.toogle = false;
            console.log(this.toogle);
        } else {
            this.toogle = true;
            console.log(this.toogle);
            this.openModal();
        }
    }

    notifyCondition() {
        console.log(this.toogle);
        if (this.toogle) {
            this.openModal();
        }
    }
}
