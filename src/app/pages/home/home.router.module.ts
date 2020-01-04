import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePage} from './home.page';

const routes: Routes = [
    {
        path: '',
        component: HomePage,
        children:
            [
                {
                    path: 'accettate',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../home-accettate/home-accettate.module#HomeAccettatePageModule'
                            }
                        ]
                },
                {
                    path: 'richieste',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../home-richieste/home-richieste.module#HomeRichiestePageModule'
                            }
                        ]
                },
                {
                    path: '',
                    redirectTo: '/home/accettate',
                    pathMatch: 'full'
                }
            ]
    },
    {
        path: '',
        redirectTo: '/home/richieste',
        pathMatch: 'full'
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class HomePageRoutingModule {}
