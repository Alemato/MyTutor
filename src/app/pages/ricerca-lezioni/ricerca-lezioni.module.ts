import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RicercaLezioniPage } from './ricerca-lezioni.page';
// tslint:disable-next-line:max-line-length
import {PopoverRicercaLezioniDisponibiliComponent} from '../../popovers/popover-ricerca-lezioni-disponibili/popover-ricerca-lezioni-disponibili.component';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: RicercaLezioniPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule
  ],
  entryComponents: [PopoverRicercaLezioniDisponibiliComponent],
  declarations: [RicercaLezioniPage, PopoverRicercaLezioniDisponibiliComponent]
})
export class RicercaLezioniPageModule {}
