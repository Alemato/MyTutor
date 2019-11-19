import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Utente} from '../../model/utente.model';
import {RegistrazioneService} from '../../services/registrazione.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.page.html',
    styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {
    private registrazioneFormModel: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        // public utente: Utente,
        private storage: Storage,
        public registrazioneService: RegistrazioneService
    ) {
    }

// vuole tutti i campi perchè si deve aspettare qualcosa
    ngOnInit() {
        this.registrazioneFormModel = this.formBuilder.group({
            // le cose che scrivo dentro [] le ritrovo sulla page registrazione.html
            nome: ['vvv'],
            cognome: ['vvv'],
            email: ['vvv'],
            password: ['vvv'],
            datanascita: [],
            regione: ['vvv'],
            citta: ['vvv'],
            cap: [],
            via: ['vvv'],
            civico: [],
            biografia: ['vvv']
        });
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
