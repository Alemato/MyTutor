import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController} from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  public risposta: string;
  public messaggio: string;
  public cont: string;
  public contProv: string;
  constructor(
      private translateService: TranslateService,
      private navController: NavController,
      private storage: Storage
  ) { }
  ngOnInit() {
    // abbozzo di storage con promise fatta male
    this.storage.get('messaggio1').then((val) => {
      this.risposta = val;
    });
    this.initTranslate();
  }
  initTranslate() {
  }
}
