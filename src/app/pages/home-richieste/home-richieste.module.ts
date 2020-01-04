import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeRichiestePage } from './home-richieste.page';

const routes: Routes = [
  {
    path: '',
    component: HomeRichiestePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeRichiestePage]
})
export class HomeRichiestePageModule {}
