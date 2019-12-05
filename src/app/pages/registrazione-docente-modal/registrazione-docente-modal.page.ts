import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Teacher} from '../../model/teacher.model';
import {User} from '../../model/user.model';

export interface Bob {
  user: User;
  postCode: string;
  city: string;
  region: string;
  street: string;
  streetNumber: string;
  byography: string;
}


@Component({
  selector: 'app-registrazione-docente-modal',
  templateUrl: './registrazione-docente-modal.page.html',
  styleUrls: ['./registrazione-docente-modal.page.scss'],
})

export class RegistrazioneDocenteModalPage implements OnInit {
  private registrazioneModelDocente: FormGroup;
  private user: User;
  private bob: Bob;
  teachr: Teacher;

  validationMessages = {
    postCode: [
      {type: 'required', message: 'campo richiesto'},
      {type: 'patten', message: 'campo non valido, inserire solo numeri'}
    ],
    region: [
      {type: 'required', message: 'campo richiesto'}
    ],
    city: [
      {type: 'required', message: 'campo richiesto'}
    ],
    street: [
      {type: 'required', message: 'campo richiesto'}
    ],
    streetNumber: [
      {type: 'required', message: 'campo richiesto'}
    ]
  };

  @Input() utente1: User;
  constructor(
      private modalController: ModalController,
      public formBuilder: FormBuilder,
      navParams: NavParams) {
    this.user = navParams.get('utente1');
    console.log(navParams.get('utente1'));
    if (navParams.get('teacher1') == null || typeof navParams.get('teacher1') === 'undefined') {
      console.log('indefinito');
    } else {
      this.teachr = navParams.get('teacher1');
    }
  }

  ngOnInit() {
    if (this.teachr == null || typeof this.teachr === 'undefined') {
      this.registrazioneModelDocente = this.formBuilder.group({
      postCode: ['', Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]{5}')
          // Validators.maxLength(5)
          //
      ])],
      region: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      streetNumber: ['', Validators.required],
      byography: ['']
    });
    } else {
      this.registrazioneModelDocente = this.formBuilder.group({
        postCode: [this.teachr.postCode],
        region: [this.teachr.region],
        city: [this.teachr.city],
        street: [this.teachr.street],
        streetNumber: [this.teachr.streetNumber],
        byography: [this.teachr.byography]
      });
    }
  }

  async closeModal() {
    this.bob = this.registrazioneModelDocente.value;
    this.bob.user = this.user;
    this.teachr = new Teacher(this.bob);
    await this.modalController.dismiss([this.teachr, true]);
  }

}
