import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfiloSingoloPage } from './profilo-singolo.page';

const routes: Routes = [
  {
    path: '',
    component: ProfiloSingoloPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfiloSingoloPage]
})
export class ProfiloSingoloPageModule {}
