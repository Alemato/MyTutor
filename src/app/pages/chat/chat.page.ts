import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {ChatService} from '../../services/chat.service';
import {ChatMessage} from '../../model/chat.model';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Observable} from 'rxjs';

@Component({
    selector: 'page-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
    public testoMessaggio: string;
    // public mexes: ChatService[];
    public idMex: number;
    public messages: ChatMessage[];                    // lista dei messaggi della chat
    public idChat = 1;                        // id provvisorio della chat per prova
    constructor(
        public chatMap: Map<string, ChatMessage[]>,    // mappa che contiene idChat come chiave e messages come valore
        public mex: ChatMessage,
        private chatMessage: ChatMessage,
        private chatService: ChatMessage,
        private translateService: TranslateService,
        private navController: NavController,
        private storage: Storage
    ) {
        // this.mexes = new Array<ChatService>();
        this.messages = new Array<ChatMessage>();
        // this.idMex = 0;
    }

    public mexFuncion() {
        console.log('inizio lo stor');
        this.storMessage();
    }

    ngOnInit() {
        console.log('ngOnInit');
        this.storage.set('idMex', 0);  // simulazione server per progressione di id messaggi
        this.storage.get('idMex').then((value) => {
            console.log('valore di default nello storage, eseguito init ' + value);
        });
        this.initTranslate();
    }

    async storMessage() {
        console.log('seguo idControll');
        await this.idControll();
    }
    provafun() {
        console.log('seguo createMessage');
        this.createMessage();
        console.log('eseguo message push');
        this.messages.push(this.mex);                   // alla lista dei messaggi della aggiungo chat il messaggio corrente creato
        console.log('eseguo chatMap set');
        this.chatMap.set(this.idChat.toString(), this.messages);
        console.log('eseguo storage set mex');
        this.storage.set('mex', this.chatMap);
        // genero la lista
        console.log('eseguo il get storage in promise');
        this.storage.get('mex').then((value) => {
            console.log('sto eseguendo la promise storage get mex');
            for (const v of value.values()) {
                console.log('i dati contenuti sono ' + v);
            }
            // value.values().forEach(valur => {
            //     console.log(valur);
        });
    }

    // metodo di generazione progressiva di id dei messaggi
     async idControll() {
        console.log('sto eseguendo la idControll');
        console.log('sto eseguendo il getFromStorage idMex in modo sincrono con await');
        await this.getFromStorage('idMex').subscribe((chiave) => {
            console.log('sto dentro la getFromStorage idMex');
            console.log('la chiave = ' + chiave);
            this.idMex = chiave;
            console.log('idMex = ' + this.idMex);
            this.provafun();
        });
         // this.storage.get('idMex').then((val) => {
        //     console.log('val = ' + val.toString());
        //     this.idMex = val;
        // });
        // this.idMex = this.idMex + 1;
        // this.storage.set('idMex', this.idMex);
        // this.storage.set('idMex', 1);
    }

    createMessage() {
        console.log('idMex su createMessage= ' + this.idMex.toString());
        console.log('setMessageId ' + this.idMex);
        console.log(this.testoMessaggio);
        this.mex = new ChatMessage();
        this.mex.messageId = this.idMex;
        console.log('dopo il settaggio');
        console.log('setMessage ' + this.testoMessaggio);
        this.mex.message = this.testoMessaggio;
        this.testoMessaggio = '';
        console.log('setUserName Mario');
        this.mex.userName = 'Mario';
        console.log('setuserID 1');
        this.mex.userId = '1';
        this.mex.userAvatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y' ;
        this.mex.time = 10;
        this.mex.status = 'prova';
        this.idMex = this.idMex + 1;     // incremento variabile di appoggio per l'id del messaggio in attesa del prossimo messaggio
        console.log('idMex ' + this.idMex);
    }

    getFromStorage(chiave: string): Observable<number> {
        console.log('costruisco observable e ritorno una promise');
        return fromPromise(this.storage.get(chiave));
    }

    initTranslate() {
    }
}
    // qua deve tedere solo: prendere messaggio, resettare il messaggio alla fine,
    // utilizzare la funzione che salva L'OGGETTO MESSAGIO (crearlo prima)
    // le altre vanno su chatservice
