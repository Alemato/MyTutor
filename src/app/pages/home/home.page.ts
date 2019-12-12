import {Component, OnDestroy, OnInit} from '@angular/core';
import { Storage } from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {Observable, interval, Subscription} from 'rxjs';
import {URL} from '../../constants';
import {ChildActivationEnd, ChildActivationStart, Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {ChatMessage} from '../../model/chat.model';
import {UserService} from '../../services/user.service';

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
        private httpClient: HttpClient,
        public navController: NavController,
        private http: HttpClient,
        private userService: UserService) {
    }

    ionViewWillEnter() {
        // this.marioVaAlCinema();
    }

    // public marioVaAlCinema() {
    //     this.films = this.httpClient.get(URL.TESTTODOS);
    //     this.bob = interval(1000).subscribe(x => {
    //         this.films.subscribe(data => {
    //             console.log('my data: ', data);
    //         });
    //     });
    // }
    // ionViewDidLeave() {
    //     console.log('prova brutta');
    //     this.bob.unsubscribe();
    // }
    public mex() {
        this.risposta = 'ricevuto ' + this.messaggio;
        this.storage.set('messaggio' , this.risposta);
        this.navController.back();
    }
    provaRest() {
        const resto = '{"idMessage":2,"text":"ciao sono mario","sendDate":1573134485642,"createDate":1573137401779,' +
            '"updateDate":1573137401779,"chat":{"idChat":"1","name":"Chtat di prova",' +
            '"chatCreateDate":1573137401779,"chatUpdateDate":1573137401779},' +
            '"users":[{"idUser":0,"name":null,"surname":null},{"idUser":1,"name":null,"surname":null}]}';
        this.http.post(URL.MESSAGE, JSON.parse(resto), {observe: 'response'}).subscribe((mes) => {
            console.log(mes);
        });
    }
    ngOnInit() {
    }

    logout() {
        this.userService.logout();
        this.navController.navigateRoot('login');
    }

    ngOnDestroy() {
        console.log('mario');
    }
}
