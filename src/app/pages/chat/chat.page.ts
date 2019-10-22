import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {ChatService} from '../../services/chat.service';
import {ChatMessage} from '../../services/chat.service';
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
    public idMex;
    public messages: ChatService[];                    // lista dei messaggi della chat
    public idChat = 1;                        // id provvisorio della chat per prova
    constructor(
        public chatMap: Map<string, ChatService[]>,    // mappa che contiene idChat come chiave e messages come valore
        public mex: ChatService,
        private chatMessage: ChatMessage,
        private chatService: ChatService,
        private translateService: TranslateService,
        private navController: NavController,
        private storage: Storage
    ) {
        // this.mexes = new Array<ChatService>();
        this.messages = new Array<ChatService>();
        // this.idMex = 0;
    }

    public mexFuncion() {
        this.storMessage();
    }
    ngOnInit() {
        this.storage.set('idMex', 0);  // simulazione server per progressione di id messaggi
        this.storage.get('idMex').then((value) => {
            console.log(value);
        });
        this.initTranslate();
    }

    storMessage() {
        this.idControll();
        this.createMessage();
        this.messages.push(this.mex);                   // alla lista dei messaggi della aggiungo chat il messaggio corrente creato
        this.chatMap.set(this.idChat.toString(), this.messages);
        this.storage.set('mex', this.chatMap);
        // genero la lista
        this.storage.get('mex').then((value) => {
            for (const v of value.values()) {
                console.log(v);
            }
            // value.values().forEach(valur => {
            //     console.log(valur);
        });
    }
    // metodo di generazione progressiva di id dei messaggi
    async idControll() {
        await this.getFromStorage('idMex').subscribe((chiave) => {
            console.log('chiave = ' + chiave);
            this.idMex = chiave;
        });
        console.log('idMex = ' + this.idMex.toString());
        // this.storage.get('idMex').then((val) => {
        //     console.log('val = ' + val.toString());
        //     this.idMex = val;
        // });
        // this.idMex = this.idMex + 1;
        // this.storage.set('idMex', this.idMex);
        // this.storage.set('idMex', 1);
    }

    async createMessage() {
        await console.log('idMex su createMessage= ' + this.idMex.toString());
        await this.mex.setMessageId(this.idMex);
        await this.mex.setMessage(this.testoMessaggio);
        await this.mex.setUserName('Mario');
        await this.mex.setuserId('1');
        await this.mex.setUserId('2');
        this.idMex = this.idMex + 1;     // incremento variabile di appoggio per l'id del messaggio in attesa del prossimo messaggio
    }
    getFromStorage(chiave: string): Observable<number> {
        return fromPromise(this.storage.get(chiave));
    }

    initTranslate() {
    }
}
