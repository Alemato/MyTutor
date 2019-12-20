import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InserimentoLezioniModalPage } from './inserimento-lezioni-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InserimentoLezioniModalPage
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
  declarations: [InserimentoLezioniModalPage]
})
export class InserimentoLezioniModalPageModule {}
