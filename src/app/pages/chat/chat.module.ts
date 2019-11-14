import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ChatPage} from './chat.page';
import {TranslateModule} from '@ngx-translate/core';
import {ChatMessage} from '../../model/chat.model';
import {ChatService} from '../../services/chat.service';

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
        RouterModule.forChild(routes)
    ],
    declarations: [ChatPage],
// qui aggiungono i componenti e le direttive da usate nel modulo/typescript (nel componente)
//     providers: [
//         Array,
//         Map
//     ]
})
export class ChatPageModule {
}
