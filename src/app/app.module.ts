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
import {ChatService} from './services/chat.service';
import {ChatMessage} from './model/chat.model';
import {httpInterceptorProviders} from './interceptors';
import {RegistrazioneDocenteModalPageModule} from './pages/registrazione-docente-modal/registrazione-docente-modal.module';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot({
            name: '__mydb',
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
        RegistrazioneDocenteModalPageModule],
    // qui si aggiungonoi componenti e le direttive da usate nel modulo/typescript (nel componente)
    providers: [
        // Array,
        ChatMessage,
        ChatService,
        Map,
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        httpInterceptorProviders
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
