import {Component, OnInit} from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    public messaggio: string;
    public risposta: string;

    constructor(
        private storage: Storage
    ) {
    }
    public mex() {
        this.risposta = 'ricevuto ' + this.messaggio;
        this.storage.set('messaggio' , this.risposta);
    }
    ngOnInit() {
    }
}
