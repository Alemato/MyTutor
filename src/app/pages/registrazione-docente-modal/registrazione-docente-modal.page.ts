import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-registrazione-docente-modal',
  templateUrl: './registrazione-docente-modal.page.html',
  styleUrls: ['./registrazione-docente-modal.page.scss'],
})
export class RegistrazioneDocenteModalPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  closeModal() {
    const data = {
      nome : 'mario',
      cognome : 'rossi'
    };
    this.modalController.dismiss(data);
  }
}
