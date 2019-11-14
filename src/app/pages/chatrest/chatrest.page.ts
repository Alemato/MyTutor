import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {ChatMessage} from '../../model/chat.model';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Observable} from 'rxjs';
import {ChatrestService} from '../../services/chatrest.service';

@Component({
  selector: 'app-chatrest',
  templateUrl: './chatrest.page.html',
  styleUrls: ['./chatrest.page.scss'],
})
export class ChatrestPage implements OnInit {
  public testoMessaggio: string;
  public idMex: number;
  public idChat = 1;                        // id provvisorio della chat per prova
  public listaMessaggi: ChatMessage[];      // lista dei messaggi della chat
  constructor(
      public b: ChatrestService,
      public chatMap: Map<string, ChatMessage[]>,    // mappa che contiene idChat come chiave e messages come valore
      public mex: ChatMessage,
      // private chatMessage: ChatMessage,
      // private chatService: ChatMessage,
      private translateService: TranslateService,
      private navController: NavController,
      private storage: Storage
  ) {
    // this.messages = new Array<ChatMessage>();
  }

  ngOnInit() {
    this.b.getMessages().subscribe((prendeMessaggi) => {
      if (prendeMessaggi) {
        this.listaMessaggi = prendeMessaggi;
      }
    });
    this.initTranslate();
  }
  async messageUpdate() {
    this.createMessage();
    this.b.postMessage(this.mex);
    this.listaMessaggi.push(this.mex);                   // alla lista dei messaggi della aggiungo chat il messaggio corrente creato
    this.chatMap.set(this.idChat.toString(), this.listaMessaggi);
    // this.b.setStoreMap('mex', this.chatMap); // mette i dati nello storage però qui non serve
}
// simulazione creazione dati del messaggio
  createMessage() {
    this.mex = new ChatMessage();
    // this.mex.messageId = this.idMex;
    this.mex.message = this.testoMessaggio;
    this.testoMessaggio = '';
    this.mex.userName = 'Zlatan';
    this.mex.userId = 1;  // ma va preso dal token
    this.mex.userAvatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
    this.mex.toUserId = 2;
    this.mex.time = 10;
    this.mex.status = 'prova';
    this.idMex = this.idMex + 1;     // incremento variabile di appoggio per l'id del messaggio in attesa del prossimo messaggio
    this.storage.set('idMex', this.idMex);
    console.log('idmex = ' + this.idMex);
  }
  initTranslate() {
  }
}
