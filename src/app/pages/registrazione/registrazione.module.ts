import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrazionePage } from './registrazione.page';
import {RegistrazioneDocenteModalPage} from '../registrazione-docente-modal/registrazione-docente-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrazionePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistrazionePage]
})
export class RegistrazionePageModule {}
