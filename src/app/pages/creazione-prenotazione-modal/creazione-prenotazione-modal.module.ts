import { NgModule } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreazionePrenotazioneModalPage } from './creazione-prenotazione-modal.page';
import {TranslateModule} from '@ngx-translate/core';
import localeIt from '@angular/common/locales/it';
import localeItExtra from '@angular/common/locales/extra/it';

registerLocaleData(localeIt, 'it-IT', localeItExtra);

const routes: Routes = [
  {
    path: '',
    component: CreazionePrenotazioneModalPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        TranslateModule
    ],
  declarations: [CreazionePrenotazioneModalPage]
})
export class CreazionePrenotazioneModalPageModule {}
