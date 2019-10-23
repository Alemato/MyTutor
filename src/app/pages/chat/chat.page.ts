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
        this.storMessage();
    }

    ngOnInit() {
        this.storage.set('idMex', 0);  // simulazione server per progressione di id messaggi
        this.storage.get('idMex').then((value) => {
        });
        this.initTranslate();
    }

    async storMessage() {
        await this.idControll();
    }
    provafun() {
        this.createMessage();
        this.messages.push(this.mex);                   // alla lista dei messaggi della aggiungo chat il messaggio corrente creato
        this.chatMap.set(this.idChat.toString(), this.messages);
        this.storage.set('mex', this.chatMap);
        // genero la lista
        this.storage.get('mex').then((value) => {
            for (const v of value.values()) {
            }
        });
    }

    // metodo di generazione progressiva di id dei messaggi
     async idControll() {
        await this.getFromStorage('idMex').subscribe((chiave) => {
            this.idMex = chiave;
            this.provafun();
        });
    }

    createMessage() {
        this.mex = new ChatMessage();
        this.mex.messageId = this.idMex;
        this.mex.message = this.testoMessaggio;
        this.testoMessaggio = '';
        this.mex.userName = 'Mario';
        this.mex.userId = '1';
        this.mex.userAvatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y' ;
        this.mex.time = 10;
        this.mex.status = 'prova';
        this.idMex = this.idMex + 1;     // incremento variabile di appoggio per l'id del messaggio in attesa del prossimo messaggio
    }

    getFromStorage(chiave: string): Observable<number> {
        return fromPromise(this.storage.get(chiave));
    }

    initTranslate() {
    }
}
    // qua deve tedere solo: prendere messaggio, resettare il messaggio alla fine,
    // utilizzare la funzione che salva L'OGGETTO MESSAGIO (crearlo prima)
    // le altre vanno su chatservice
