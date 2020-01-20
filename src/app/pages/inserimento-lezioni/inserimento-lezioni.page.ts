import {Component, OnInit} from '@angular/core';
import {Lezione} from '../../model/old/lezione.model';
import {Storage} from '@ionic/storage';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Utente} from '../../model/old/utente.model';
import {ModalController} from '@ionic/angular';
import {InserimentoLezioniModalPage} from '../inserimento-lezioni-modal/inserimento-lezioni-modal.page';

@Component({
    selector: 'app-inserimento-lezioni',
    templateUrl: './inserimento-lezioni.page.html',
    styleUrls: ['./inserimento-lezioni.page.scss'],
})
export class InserimentoLezioniPage implements OnInit {
    private lezioni$: BehaviorSubject<Lezione> = new BehaviorSubject<Lezione>({} as Lezione);
    private lezioneFormModel: FormGroup;
    public lezioni: Lezione[];
    public lezione: Lezione;
    public lezioneapp: Lezione = new Lezione();  // è settato tutto a Null però esiste
    private ok = false;

    constructor(
        private storage: Storage,
        public formBuilder: FormBuilder,
        public modalController: ModalController,
    ) {
    }

    async carimanetoLezioni() {
        if (await this.storage.get('lez') !== 'undefined') {
            this.lezioni = await this.storage.get('lez');
        } else {
            this.lezioni = new Array<Lezione>();
        }
    }

    ngOnInit() {
        this.lezioneFormModel = this.formBuilder.group({
            nomeLezione: ['', Validators.required],
            macroMateria: ['', Validators.required],
            microMateria: ['', Validators.required],
            prezzoOrario: ['', Validators.required],
            descrizione: ['', Validators.required],
        });
    }

    async inserisciLezione() {
        // await this.carimanetoLezioni();
        this.lezione = this.lezioneFormModel.value;
        this.lezione.lezioneDataOraInFin = this.lezioneapp.lezioneDataOraInFin;
        // this.lezioni.push(this.lezione);
        // this.storage.set('lez', this.lezioni);
        console.log(this.lezione);
    }

    notificaCondizione() {
        this.apriModale();
    }

    async apriModale() {
      const modal = await this.modalController.create({
        component: InserimentoLezioniModalPage,
      });
      modal.onDidDismiss().then((dataReturned) => {
        console.log('i dati sono: ');
        console.log(dataReturned.data);
        this.lezioneapp.lezioneDataOraInFin = dataReturned.data[0].dataOraIF;
        // console.log(this.lezioneapp);
        this.ok = dataReturned.data[1];
        console.log(this.ok);
      });
      await modal.present();
    }
}
