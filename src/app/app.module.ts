import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {IonicStorageModule} from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import {ChatService} from './services/chat.service';
import {httpInterceptorProviders} from './interceptors';
import {RegistrazioneDocenteModalPageModule} from './pages/registrazione-docente-modal/registrazione-docente-modal.module';
import {ProfiloPageModule} from './pages/profilo/profilo.module';
import {ModificaProfiloPageModule} from './pages/modifica-profilo/modifica-profilo.module';
import {MenuRefresh} from './services/menuRefresh';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {InserimentoLezioniModalPageModule} from './pages/inserimento-lezioni-modal/inserimento-lezioni-modal.module';
import {UserService} from './services/user.service';
import {DettagliPianificazioneModalPageModule} from './pages/dettagli-pianificazione-modal-page/dettagli-pianificazione-modal-page.module';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(),
        FontAwesomeModule,  // per le icone
        IonicStorageModule.forRoot({
            name: 'myTutor',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        RegistrazioneDocenteModalPageModule,
        ProfiloPageModule,
        ModificaProfiloPageModule,
        InserimentoLezioniModalPageModule,
        DettagliPianificazioneModalPageModule
    ],
    // qui si aggiungonoi componenti e le direttive da usate nel modulo/typescript (nel componente)
    providers: [
        ChatService,
        UserService,
        Map,
        StatusBar,
        SplashScreen,
        MenuRefresh,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        httpInterceptorProviders,
        Crop,
        Camera,
        File
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
