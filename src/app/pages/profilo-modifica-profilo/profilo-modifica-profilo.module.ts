import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfiloModificaProfiloPage } from './profilo-modifica-profilo.page';
import {SuperTabsModule} from '@ionic-super-tabs/angular';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ProfiloModificaProfiloPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SuperTabsModule,
        TranslateModule
    ],
  declarations: [ProfiloModificaProfiloPage]
})
export class ProfiloModificaProfiloPageModule {}
