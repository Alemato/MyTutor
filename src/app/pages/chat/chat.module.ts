import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ChatPage} from './chat.page';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
    {
        path: '',
        component: ChatPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forChild(),
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    declarations: [ChatPage]
})
export class ChatPageModule {
}
