import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeItExtra from '@angular/common/locales/extra/it';

import { IonicModule } from '@ionic/angular';

import { ListaPianificazioniPage } from './lista-pianificazioni.page';
import {PopoverRepeatListComponent} from '../../popovers/popover-repeat-list/popover-repeat-list.component';
import {TranslateModule} from '@ngx-translate/core';

registerLocaleData(localeIt, 'it-IT', localeItExtra);

const routes: Routes = [
  {
    path: '',
    component: ListaPianificazioniPage
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
  entryComponents: [PopoverRepeatListComponent],
  declarations: [ListaPianificazioniPage, PopoverRepeatListComponent]
})
export class ListaPianificazioniPageModule {}
