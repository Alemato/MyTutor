import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import { HomePage } from './home.page';
import {TranslateModule} from '@ngx-translate/core';

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
    CommonModule,
    /*TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),*/
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
