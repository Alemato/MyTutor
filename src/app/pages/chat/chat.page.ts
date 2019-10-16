import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController} from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  constructor(
      private translateService: TranslateService,
      private navController: NavController,
      private storage: Storage
  ) { }

  ngOnInit() {
    this.initTranslate();
  }
  initTranslate() {
  }
}
