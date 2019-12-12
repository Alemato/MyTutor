import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Utente} from '../../model/utente.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Events} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import { faGift, faCity, faRoad, faIdCard } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'modifica-profilo',
    templateUrl: './modifica-profilo.page.html',
    styleUrls: ['./modifica-profilo.page.scss'],
})
export class ModificaProfiloPage implements OnInit {
    private students$: BehaviorSubject<Utente> = new BehaviorSubject<Utente>({} as Utente);
    private profiloFormModel: FormGroup;
    public utente: Utente;
    public passwordType = 'password';
    public passwordShow = false;
    faGift = faGift;
    faCity = faCity;
    faRoad = faRoad;
    faIdCard = faIdCard;

    constructor(
        private storage: Storage,
        public events: Events,
        public formBuilder: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.profiloFormModel = this.formBuilder.group({
            // le cose che scrivo dentro [] le ritrovo sulla page registrazione.html
            nome: ['', Validators.required],
            cognome: ['', Validators.required],
            email: ['', Validators.required],
            password1: ['', Validators.compose([
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])
            ],
            password2: ['', Validators.compose([
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])
            ],
            datanascita: ['', Validators.required],
            regione: ['', Validators.required],
            citta: ['', Validators.required],
            cap: ['', Validators.required],
            via: ['', Validators.required],
            civico: ['', Validators.required],
            biografia: ['', Validators.required],
        });
        this.storage.get('ute').then((value) => {
            this.students$.next(value);
            // @ts-ignore
            this.students$.value.password1 = '';
            // @ts-ignore
            this.students$.value.password2 = '';
            this.profiloFormModel.patchValue(this.students$.value);
        });
    }

    async salvaModifica() {
        const utente: Utente = this.profiloFormModel.value;
        await this.storage.set('ute', utente);
        this.events.publish('aggiorna', utente);
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
}
