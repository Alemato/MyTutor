import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StoricoLezioniPage } from './storico-lezioni.page';
import {PopoverFiltroStoricoLezioniComponent} from '../../popovers/popover-filtro-storico-lezioni/popover-filtro-storico-lezioni.component';

const routes: Routes = [
  {
    path: '',
    component: StoricoLezioniPage
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
  entryComponents: [PopoverFiltroStoricoLezioniComponent],
  declarations: [StoricoLezioniPage, PopoverFiltroStoricoLezioniComponent]
})
export class StoricoLezioniPageModule {}
