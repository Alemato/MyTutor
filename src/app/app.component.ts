import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {TranslateService} from '@ngx-translate/core';
import {LinguaService} from './services/lingua.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private translateService: TranslateService,
        private platform: Platform,
        private translate: TranslateService,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private linguaService: LinguaService,
    ) {
        this.initializeApp();
    }

    public appPages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'Chat',
            url: '/chat',
            icon: 'logo-android'
        }
    ];

    initializeApp() {
        this.platform.ready().then(() => {
            this.initTranslate();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    initTranslate() {
        // Set the default language for translation strings, and the current language.
        const linguaPreferita = this.linguaService.getLinguaPreferita();
        this.translate.setDefaultLang(linguaPreferita);
        this.linguaService.getLinguaAttuale().subscribe((lingua: string) => {
            if (lingua != null) {
                this.translate.use(lingua);
            } else {
                this.translate.use(linguaPreferita);
                this.linguaService.updateLingua(linguaPreferita);
                // salva nello storage
            }
        });
    }
}
