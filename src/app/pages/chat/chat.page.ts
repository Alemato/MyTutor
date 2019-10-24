import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
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
        this.messages = new Array<ChatMessage>();
    }
    async ngOnInit() {
        // this.storage.clear();                              // decommentare per pulire lo storage
        // al primo avvio controlla se ci sono messaggi nello storage ed in tal caso li preleva per aggiungerlo a messages
        // e quindi metterli nella lista di messaggi della presentazione
        await this.storage.get('mex').then((value) => {
            if (value) {
                for (const v of value.values()) {
                    this.messages = v;
                    // aggiorniamo idMex prendendo la lunghezza della lista di messaggi salvati nello storage che sono in messages
                    this.idMex = this.messages.length;
                    this.storage.set('idMex', this.idMex);
                    console.log('idMex X = ' + this.idMex);
                }
            } else {
                // se non ci sono messaggi precedenti inviati nella chat impostiamo ldMex a 0 nello storage
                this.storage.set('idMex', 0);
            }
        });
        this.initTranslate();
    }

    async messageUpdate() {
        this.createMessage();
        // aggiorno la lista di messages
        await this.storage.get('mex').then((value) => {
            if (value) {
                for (const v of value.values()) {
                    this.messages = v;
                }
            }
        });
        this.messages.push(this.mex);                   // alla lista dei messaggi della aggiungo chat il messaggio corrente creato
        this.chatMap.set(this.idChat.toString(), this.messages);
        await this.storage.set('mex', this.chatMap);
    }

    // funzione iniziale che parte all'invio del messaggio
    async maxFunction() {
        await this.getFromStorageId('idMex').subscribe((chiave) => {
            this.idMex = chiave;
            this.messageUpdate();
        });
    }
    // simulazione creazione dati del messaggio
    createMessage() {
        this.mex = new ChatMessage();
        this.mex.messageId = this.idMex;
        this.mex.message = this.testoMessaggio;
        this.testoMessaggio = '';
        this.mex.userName = 'Mario';
        this.mex.userId = 2;
        this.mex.userAvatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
        this.mex.toUserId = 1;
        this.mex.time = 10;
        this.mex.status = 'prova';
        this.idMex = this.idMex + 1;     // incremento variabile di appoggio per l'id del messaggio in attesa del prossimo messaggio
        this.storage.set('idMex', this.idMex);
        console.log('idmex = ' + this.idMex);
    }

    getFromStorageId(chiave: string): Observable<number> {
        return fromPromise(this.storage.get(chiave));
    }
    getFromStorageMex(chiave: string): Observable<ChatMessage[]> {
        return fromPromise(this.storage.get(chiave));
    }

    initTranslate() {
    }
}

// qua deve tedere solo: prendere messaggio, resettare il messaggio alla fine,
// utilizzare la funzione che salva L'OGGETTO MESSAGIO (crearlo prima)
// le altre vanno su chatservice

