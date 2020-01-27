import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RisultatiRicercaPage } from './risultati-ricerca.page';
import {PopoverRisultatiRicercaComponent} from '../../popovers/popover-risultati-ricerca/popover-risultati-ricerca.component';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: RisultatiRicercaPage
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
  entryComponents: [PopoverRisultatiRicercaComponent],
  declarations: [RisultatiRicercaPage, PopoverRisultatiRicercaComponent]
})
export class RisultatiRicercaPageModule {}
