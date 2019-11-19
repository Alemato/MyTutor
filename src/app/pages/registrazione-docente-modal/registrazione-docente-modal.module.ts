import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrazioneDocenteModalPage } from './registrazione-docente-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrazioneDocenteModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistrazioneDocenteModalPage]
})
export class RegistrazioneDocenteModalPageModule {}
