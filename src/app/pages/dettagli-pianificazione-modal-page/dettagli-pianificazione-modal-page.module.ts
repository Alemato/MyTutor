import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeItExtra from '@angular/common/locales/extra/it';

import { IonicModule } from '@ionic/angular';

import { DettagliPianificazioneModalPage } from './dettagli-pianificazione-modal-page.page';
import {TranslateModule} from '@ngx-translate/core';

registerLocaleData(localeIt, 'it-IT', localeItExtra);

const routes: Routes = [
  {
    path: '',
    component: DettagliPianificazioneModalPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
  providers: [DatePipe],
  declarations: [DettagliPianificazioneModalPage]
})
export class DettagliPianificazioneModalPageModule {}
