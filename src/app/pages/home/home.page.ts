import {Component, OnDestroy, OnInit} from '@angular/core';
import { Storage } from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {Observable, interval, Subscription} from 'rxjs';
import {URL} from '../../constants';
import {ChildActivationEnd, ChildActivationStart, Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    public messaggio: string;
    public risposta: string;
    bob: Subscription;
    films: Observable<any>;
    constructor(
        private storage: Storage,
        private httpClient: HttpClient) {
    }

    ionViewWillEnter() {
        this.marioVaAlCinema();
    }

    public marioVaAlCinema() {
        this.films = this.httpClient.get(URL.TESTTODOS);
        this.bob = interval(1000).subscribe(x => {
            this.films.subscribe(data => {
                console.log('my data: ', data);
            });
        });
    }
    ionViewDidLeave() {
        console.log('prova brutta');
        this.bob.unsubscribe();
    }
    public mex() {
        this.risposta = 'ricevuto ' + this.messaggio;
        this.storage.set('messaggio' , this.risposta);
    }
    ngOnInit() {

    }

    ngOnDestroy() {
        console.log('mario');
    }
}
