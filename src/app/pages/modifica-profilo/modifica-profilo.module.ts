import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModificaProfiloPage } from './modifica-profilo.page';

const routes: Routes = [
  {
    path: '',
    component: ModificaProfiloPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModificaProfiloPage]
})
export class ModificaProfiloPageModule {}
