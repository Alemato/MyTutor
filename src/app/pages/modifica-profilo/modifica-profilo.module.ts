import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModificaProfiloPage } from './modifica-profilo.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

const routes: Routes = [
  {
    path: '',
    component: ModificaProfiloPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        FontAwesomeModule
    ],
  declarations: [ModificaProfiloPage]
})
export class ModificaProfiloPageModule {}
