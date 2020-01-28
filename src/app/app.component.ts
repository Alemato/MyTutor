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
import {ChatService} from './services/chat.service';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    private userType: string;
    private student$: BehaviorSubject<Student>;
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
        private chatService: ChatService,
        private navController: NavController,
        private menuSource: MenuRefresh,
        private menu: MenuController
    ) {
        this.initializeApp();
        this.menuSource.menuRefreshSource$.subscribe(() => {
            this.initTranslate();
            this.userType = this.userService.getTypeUser();
            console.log(this.userType);
            if (this.userType === 'student') {
                this.student$ = this.userService.getUser();
                this.teacher$ = null;
                console.log(this.appPagesStudent);
                this.appPagesStudent.find(x => x.click === true).click = false;
                this.appPagesStudent.find(x => x.title === 'Home').click = true;
            } else if (this.userType === 'teacher') {
                this.teacher$ = this.userService.getUser();
                this.student$ = null;
                this.appPagesTeacher.find(x => x.click === true).click = false;
                this.appPagesTeacher.find(x => x.title === 'Home').click = true;
            }
            this.userService.loggedIn$.subscribe(value => {
                this.loggedIn = value;
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
            url: '/lista-chat',
            icon: 'chatboxes',
            click: false
        },
        {
            title: 'HISTORIC_SIDE_MENU',
            url: '/storico-lezioni',
            icon: 'time',
            click: false
        },
        {
            title: 'SEARCH_LESSONS_SIDE_MENU',
            url: '/ricerca-lezioni',
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
            url: '/lista-chat',
            icon: 'chatboxes',
            click: false
        },
        {
            title: 'HISTORIC_SIDE_MENU',
            url: '/storico-lezioni',
            icon: 'time',
            click: false
        },
        {
            title: 'INSERT_AD_SIDE_MENU',
            url: '/inserimento-lezioni',
            icon: 'create',
            click: false
        },
        {
            title: 'ADVERTISEMENTS_PLACED_TITLE',
            url: '/lista-annunci-publicati',
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
                } else {
                    this.menuSource.publishMenuRefresh();
                }
            });
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {
        this.userType = this.userService.getTypeUser();
        console.log('onInit');
        console.log(this.userType);
        this.chatService.startPeriodicGetCountChat();
        this.navController.navigateRoot('home');
    }

    profilo() {
        this.navController.navigateForward('profilo').finally(() => {
            this.menu.close();
        });
    }

    openPage(url: string) {
        this.navController.navigateForward(url);
    }

    async closeMenu(event: any, url: string) {
        await this.menu.close();
        this.openPage(url);
        if (this.userType === 'student') {
            if (event.path[0].innerText !== undefined) {
                this.appPagesStudent.find(x => x.click === true).click = false;
                this.appPagesStudent.find(x => x.title === event.path[0].innerText).click = true;
            }
        } else if (this.userType === 'teacher') {
            if (event.path[0].innerText !== undefined) {
                this.appPagesTeacher.find(x => x.click === true).click = false;
                this.appPagesTeacher.find(x => x.title === event.path[0].innerText).click = true;
            }
        }
    }

    async logout() {
        this.chatService.stopPeriodicGetCountChat();
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
                this.translateService.get('HISTORIC_SIDE_MENU').subscribe((history) => {
                    this.appPagesTeacher[2].title = history;
                    this.appPagesStudent[2].title = history;
                });
                this.translateService.get('INSERT_AD_SIDE_MENU').subscribe((insert) => {
                    this.appPagesTeacher[3].title = insert;
                });
                this.translateService.get('ADVERTISEMENTS_PLACED_TITLE').subscribe((adv) => {
                    this.appPagesTeacher[4].title = adv;
                    console.log(this.appPagesTeacher);
                });
                this.translateService.get('SEARCH_LESSONS_SIDE_MENU').subscribe((searc) => {
                    this.appPagesStudent[3].title = searc;
                });
            } else {
                this.translate.use(linguaPreferita);
                this.linguaService.updateLingua(linguaPreferita);
                this.translateService.get('HISTORIC_SIDE_MENU').subscribe((history) => {
                    this.appPagesTeacher[2].title = history;
                    this.appPagesStudent[2].title = history;
                });
                this.translateService.get('INSERT_AD_SIDE_MENU').subscribe((insert) => {
                    this.appPagesTeacher[3].title = insert;
                });
                this.translateService.get('ADVERTISEMENTS_PLACED_TITLE').subscribe((adv) => {
                    this.appPagesTeacher[4].title = adv;
                    console.log(this.appPagesTeacher);
                });
                this.translateService.get('SEARCH_LESSONS_SIDE_MENU').subscribe((searc) => {
                    this.appPagesStudent[3].title = searc;
                });
                // salva nello storage
            }
        });
    }
}
