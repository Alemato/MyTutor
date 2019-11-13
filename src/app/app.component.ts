import {Component, OnInit} from '@angular/core';

import {Events, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {TranslateService} from '@ngx-translate/core';
import {LinguaService} from './services/lingua.service';
import {UserService} from './services/user.service';
import {BehaviorSubject} from 'rxjs';
import {Student} from './model/student.model';
import {Teacher} from './model/teacher.model';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    private student$: BehaviorSubject<Student>;
    private teacher$: BehaviorSubject<Teacher>;

    constructor(
        public events: Events,
        private translateService: TranslateService,
        private platform: Platform,
        private translate: TranslateService,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private linguaService: LinguaService,
        private userService: UserService,
        private navController: NavController
    ) {
        this.initializeApp();
        this.events.subscribe('leaveLogin', assert => {
            if (assert) {
                if (this.userService.whichUserType() === 'student') {
                    this.student$ = this.userService.getStudent();
                } else if (this.userService.whichUserType() === 'teacher') {
                    this.teacher$ = this.userService.getTeacher();
                } else if (this.userService.whichUserType() === 'admin') {
                    this.teacher$ = this.userService.getTeacher();
                    console.log('sono l\'admin');
                }
            }
        });
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

    ngOnInit() {
    }
    logout() {
        this.userService.logout();
        this.navController.navigateRoot('login');
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
