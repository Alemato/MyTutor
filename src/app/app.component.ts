import {Component, OnInit} from '@angular/core';
import {MenuController, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {TranslateService} from '@ngx-translate/core';
import {LinguaService} from './services/lingua.service';
import {UserService} from './services/user.service';
import {BehaviorSubject} from 'rxjs';
import {MenuRefresh} from './services/menuRefresh';
import {ChatService} from './services/chat.service';
import {User} from './model/user.model';
import {Router} from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    private user$: BehaviorSubject<User>;

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
        private menu: MenuController,
        private router: Router
    ) {
        this.initializeApp();
        this.menuSource.menuRefreshSource$.subscribe(() => {
            this.initTranslate();
            this.user$ = this.userService.getUser();
            console.log(this.router.url);
            if (this.user$.value.roles === 1) {
                this.appPagesStudent.find(x => x.click === true).click = false;
                this.appPagesStudent.find(x => x.url === this.router.url).click = true;
            }
            if (this.user$.value.roles === 2) {
                this.appPagesTeacher.find(x => x.click === true).click = false;
                this.appPagesTeacher.find(x => x.url === this.router.url).click = true;
            }
        });
    }

    public appPagesStudent = [
        {
            title: 'Home',
            url: '/',
            icon: 'home',
            click: true
        },
        {
            title: 'HISTORIC_SIDE_MENU',
            url: '/storico-lezioni',
            icon: 'time',
            click: false
        }
    ];

    public appPagesTeacher = [
        {
            title: 'Home',
            url: '/',
            icon: 'home',
            click: true
        },
        {
            title: 'HISTORIC_SIDE_MENU',
            url: '/storico-lezioni',
            icon: 'time',
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
        console.log('onInit');
        this.chatService.startPeriodicGetCountChat();
        this.navController.navigateRoot('/tabs/home');
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
    }

    async logout() {
        this.chatService.stopPeriodicGetCountChat();
        await this.menu.close();
        await this.userService.logout();
        await this.navController.navigateRoot('login');
    }

    initTranslate() {
        const linguaPreferita = this.linguaService.getLinguaPreferita();
        this.translate.setDefaultLang(linguaPreferita);
        this.linguaService.getLinguaAttuale().subscribe((lingua: string) => {
            if (lingua != null) {
                this.translate.use(lingua);
                this.translateService.get('HISTORIC_SIDE_MENU').subscribe((history) => {
                    this.appPagesTeacher[1].title = history;
                    this.appPagesStudent[1].title = history;
                });
                this.translateService.get('ADVERTISEMENTS_PLACED_TITLE').subscribe((adv) => {
                    this.appPagesTeacher[2].title = adv;
                });
            } else {
                this.translate.use(linguaPreferita);
                this.linguaService.updateLingua(linguaPreferita);
                this.translateService.get('HISTORIC_SIDE_MENU').subscribe((history) => {
                    this.appPagesTeacher[1].title = history;
                    this.appPagesStudent[1].title = history;
                });
                this.translateService.get('ADVERTISEMENTS_PLACED_TITLE').subscribe((adv) => {
                    this.appPagesTeacher[2].title = adv;
                });
            }
        });
    }
}
