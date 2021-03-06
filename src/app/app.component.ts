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
import {Router} from '@angular/router';
import {Student} from './model/student.model';
import {Teacher} from './model/teacher.model';
import {BookingService} from './services/booking.service';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    private user$: BehaviorSubject<Student | Teacher>;

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

    constructor(
        private translateService: TranslateService,
        private platform: Platform,
        private translate: TranslateService,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private linguaService: LinguaService,
        private userService: UserService,
        private chatService: ChatService,
        private bookingService: BookingService,
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
                // setto il colore cliccato del menu per lo studente
                if (this.router.url === '/tabs/home') {
                    this.appPagesStudent.find(x => x.click === true).click = false;
                    this.appPagesStudent.find(x => x.url === '/').click = true;
                } else {
                    const page = this.appPagesStudent.find(x => x.url === this.router.url);
                    if (page !== undefined) {
                        this.appPagesStudent.find(x => x.click === true).click = false;
                        page.click = true;
                    }
                }
            }
            if (this.user$.value.roles === 2) {
                // setto il colore cliccato del menu per il teacher
                if (this.router.url === '/tabs/home') {
                    this.appPagesTeacher.find(x => x.click === true).click = false;
                    this.appPagesTeacher.find(x => x.url === '/').click = true;
                } else {
                    const page = this.appPagesTeacher.find(x => x.url === this.router.url);
                    if (page !== undefined) {
                        this.appPagesTeacher.find(x => x.click === true).click = false;
                        page.click = true;
                    }
                }
            }
        });
    }

    /**
     * avvio l'aggiornamento della chat e vado alla home
     */
    ngOnInit() {
        console.log('onInit');
        this.chatService.startPeriodicGetCountChat();
        this.navController.navigateRoot('/tabs/home');
    }

    /**
     * Funzione di inizializzazione app
     */
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

    /**
     * Funzione di apertura pagina
     * @param url a cui andare
     */
    openPage(url: string) {
        this.navController.navigateForward(url).then(() => {
            this.menu.close().then(() => {
                this.menuSource.publishMenuRefresh();
            });
        });
    }

    /**
     * Funzione di logout
     */
    async logout() {
        this.chatService.stopPeriodicGetCountChat();
        this.bookingService.stopPeriodicGet();
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
