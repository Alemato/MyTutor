import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import { HomePage } from './home.page';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
// import {HomePageRoutingModule} from './home.router.module';

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
    // HomePageRoutingModule,
    RouterModule.forChild(routes)
    /*RouterModule.forChild([
      {
        path:  '',
        component: HomePage
      }
    ])*/
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
