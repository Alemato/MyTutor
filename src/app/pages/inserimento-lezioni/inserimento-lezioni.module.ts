import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InserimentoLezioniPage } from './inserimento-lezioni.page';

const routes: Routes = [
  {
    path: '',
    component: InserimentoLezioniPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
  declarations: [InserimentoLezioniPage]
})
export class InserimentoLezioniPageModule {}
