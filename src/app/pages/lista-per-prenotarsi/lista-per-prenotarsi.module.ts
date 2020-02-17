import { NgModule } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaPerPrenotarsiPage } from './lista-per-prenotarsi.page';
import localeIt from '@angular/common/locales/it';
import localeItExtra from '@angular/common/locales/extra/it';
import {TranslateModule} from '@ngx-translate/core';

registerLocaleData(localeIt, 'it-IT', localeItExtra);

const routes: Routes = [
  {
    path: '',
    component: ListaPerPrenotarsiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [ListaPerPrenotarsiPage]
})
export class ListaPerPrenotarsiPageModule {}
