import { Component, OnInit } from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-popover-risultati-ricerca',
  templateUrl: './popover-risultati-ricerca.component.html',
  styleUrls: ['./popover-risultati-ricerca.component.scss'],
})
export class PopoverRisultatiRicercaComponent implements OnInit {

  slot;
  day;

  constructor(public popoverController: PopoverController, private navParams: NavParams,) { }

  ngOnInit() {
    this.slot = this.navParams.get('dati');
    this.day = this.navParams.get('giorno');
  }

  close() {
    this.popoverController.dismiss();
  }
}
