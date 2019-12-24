import {Component, OnInit} from '@angular/core';

import {MenuController, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {TranslateService} from '@ngx-translate/core';
import {LinguaService} from './services/lingua.service';
import {UserService} from './services/user.service';
import {BehaviorSubject} from 'rxjs';
import {Student} from './model/student.model';
import {Teacher} from './model/teacher.model';
import {MenuRefresh} from './services/menuRefresh';
import {Storage} from '@ionic/storage';
import {AUTH_TOKEN} from './constants';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    private student$: BehaviorSubject<Student>;
    private a$: BehaviorSubject<Student>;
    private teacher$: BehaviorSubject<Teacher>;
    private loggedIn: boolean;

    constructor(
        private translateService: TranslateService,
        private platform: Platform,
        private translate: TranslateService,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private linguaService: LinguaService,
        private userService: UserService,
        private navController: NavController,
        private menuSource: MenuRefresh,
        private menu: MenuController,
        private storage: Storage
    ) {
        this.initializeApp();
        this.menuSource.menuRefreshSource$.subscribe(assert => {
            console.log('which');
            this.userService.whichUserType().then((tipo) => {
                console.log(tipo);
                if (tipo === 'student') {
                    this.student$ = this.userService.getStudent();
                    this.appPagesStudent.find(x => x.click === true).click = false;
                    this.appPagesStudent.find(x => x.title === 'Home' ).click = true;
                } else if (tipo === 'teacher') {
                    this.teacher$ = this.userService.getTeacher();
                    this.appPagesTeacher.find(x => x.click === true).click = false;
                    this.appPagesTeacher.find(x => x.title === 'Home' ).click = true;
                }
                this.storage.get('loggedIn').then((loggato) => {
                    if (loggato) {
                        console.log('loggato = ' + loggato);
                        this.loggedIn = loggato;
                    } else {
                        console.log('loggato =  false');
                        this.loggedIn = false;
                    }
                });
            });
        });
    }

    public appPagesStudent = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home',
            click: true
        },
        {
            title: 'Chat',
            url: '/chat',
            icon: 'chatboxes',
            click: false
        },
        {
            title: 'Storico',
            url: '/',
            icon: 'time',
            click: false
        },
        {
            title: 'Cerca Lezioni Disponibili',
            url: '/',
            icon: 'search',
            click: false
        }
    ];

    public appPagesTeacher = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home',
            click: true
        },
        {
            title: 'Chat',
            url: '/chat',
            icon: 'chatboxes',
            click: false
        },
        {
            title: 'Storico',
            url: '/',
            icon: 'time',
            click: false
        },
        {
            title: 'Inserisci Annuncio',
            url: '/',
            icon: 'create',
            click: false
        },
        {
            title: 'Annunci Publicati',
            url: '/',
            icon: 'filing',
            click: false
        }
    ];

    initializeApp() {
        this.platform.ready().then(() => {
            this.initTranslate();
            this.userService.ifExistKey('auth-token').then((condiction) => {
                if (!condiction) {
                    console.log('setto falso ');
                    this.userService.setLoggeIn(false);
                }
            });
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.menuSource.publishMenuRefresh();
        });
    }

    ngOnInit() {
    }

    async closeMenu(event: any) {
        await this.menu.close();
        this.appPagesStudent.find(x => x.click === true).click = false;
        this.appPagesStudent.find(x => x.title === event.path[0].innerText).click = true;
    }

    async logout() {
        await this.menu.close();
        await this.userService.logout();
        await this.navController.navigateRoot('login');
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
