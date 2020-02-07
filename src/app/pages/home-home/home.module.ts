import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import { HomePage } from './home.page';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {/*
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
                    loadChildren: '../home-home-accettate/home-home-accettate.module#HomeAccettatePageModule'
                  }
                ]
          },
          {
            path: 'richieste',
            children:
                [
                  {
                    path: '',
                    loadChildren: '../home-home-richieste/home-home-richieste.module#HomeRichiestePageModule'
                  }
                ]
          },
            {
                path: 'inserisci-lezione',
                children:
                    [
                        {
                            path: '',
                            loadChildren: '../home-home-richieste/home-home-richieste.module#HomeRichiestePageModule'
                        }
                    ]
            },
          {
            path: '',
            redirectTo: '/home-home/accettate',
            pathMatch: 'full'
          }
        ]
  },
  {
    path: '',
    redirectTo: '/home-home/richieste',
    pathMatch: 'full'*/
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
