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
  public messaggio1: string;
  public messaggio2: string;
  constructor(
      private translateService: TranslateService,
      private navController: NavController,
      private storage: Storage
  ) { }
  public  mex1() {
    console.log(this.messaggio1);
    this.messaggio2 = this.messaggio1;
    this.messaggio1="";
    this.storage.set('messaggio2', 'this.messaggio2');
  }
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
