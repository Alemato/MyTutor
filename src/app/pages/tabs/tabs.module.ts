import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {TabsPage} from './tabs.page';
import {AuthGuard} from '../../guards/auth.guard';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children:
            [
                {
                    path: 'home',
                    children: [
                        {
                            path: '',
                            loadChildren: '../home/home.module#HomePageModule',
                            canActivate: [AuthGuard]
                        }
                    ]
                },
                {
                    path: 'inserisci-lezione',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../inserimento-lezioni/inserimento-lezioni.module#InserimentoLezioniPageModule',
                                data: {isInsert: true, lesson: {}, listaAnnunci: false},
                                canActivate: [AuthGuard]
                            }
                        ]
                },
                {
                    path: 'ricerca-lezioni',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../ricerca-lezioni/ricerca-lezioni.module#RicercaLezioniPageModule',
                                canActivate: [AuthGuard]
                            }
                        ]
                },
                {
                    path: 'richieste',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../richieste/richieste.module#RichiestePageModule',
                                canActivate: [AuthGuard]
                            },
                        ]
                },
                {
                    path: 'lista-chat',
                    children: [
                        {
                            path: '',
                            loadChildren: '../lista-chat/lista-chat.module#ListaChatPageModule',
                            canActivate: [AuthGuard]
                        }
                    ]
                },
                {
                    path: '',
                    redirectTo: '/tabs/home',
                    pathMatch: 'full'
                }
            ]
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
    declarations: [TabsPage]
})
export class TabsPageModule {
}
