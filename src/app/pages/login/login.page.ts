import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, MenuController, NavController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Account, UserService} from '../../services/user.service';
import {MenuRefresh} from '../../services/menuRefresh';

@Component({
    selector: 'page-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    private loginFormModel: FormGroup;
    private loginTitle: string;
    private loginSubTitle: string;
    private pleaseWaitMessage: string;
    passwordType = 'password';
    passwordShow = false;
    private loading;


    constructor(private formBuilder: FormBuilder,
                private alertController: AlertController,
                private translateService: TranslateService,
                private navController: NavController,
                private userService: UserService,
                public menuCtrl: MenuController,
                public loadingController: LoadingController,
                private menuSource: MenuRefresh) {
    }

    /**
     * funzione che attiva la visulizzazione della password
     */
    public togglePassword() {
        if (this.passwordShow) {
            this.passwordShow = false;
            this.passwordType = 'password';
        } else {
            this.passwordShow = true;
            this.passwordType = 'text';
        }
    }

    ngOnInit() {
        this.initTranslate();
        this.loginFormModel = this.formBuilder.group({
            username: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                // tslint:disable-next-line:max-line-length
                Validators.pattern('(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')
            ])],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{5,40}$')
            ])]
        });
    }

    ionViewDidLeave() {
        this.menuCtrl.enable(true);
        this.menuSource.publishMenuRefresh();
    }

    async Loading() {
        this.loading = await this.loadingController.create({
            message: this.pleaseWaitMessage,
            translucent: true
        });
        return await this.loading.present();
    }

    async Diss() {
        await this.loading.dismiss();
    }

    /**
     * Prendo i dati dalla form, eseguo la rest di login che ritorna un token JWT e l'oggetto user che si ?? loggato
     */
    onLogin() {
        const account: Account = this.loginFormModel.value;
        console.log(account);
        this.Loading().then(() => {
            this.userService.login(account).subscribe(() => {
                    this.Diss();
                    this.loginFormModel.reset();
                    this.navController.navigateRoot('/');
                },
                (err: HttpErrorResponse) => {
                    console.log(err);
                    if (err.status === 401) {
                        console.error('login request error: ' + err.status);
                        this.showLoginError();
                        this.loginFormModel.controls.password.reset();
                    }
                    if (err.status === 500) {
                        console.error('login request error: ' + err.status);
                        this.showLoginError();
                    }
                });
        });
    }

    /**
     * funzione che fa verde un possibile errore nella rest di login
     */
    async showLoginError() {
        this.Diss();
        const alert = await this.alertController.create({
            header: this.loginTitle,
            message: this.loginSubTitle,
            buttons: ['OK']
        });

        await alert.present();
    }

    private initTranslate() {
        this.translateService.get('LOGIN_ERROR_SUB_TITLE').subscribe((data) => {
            this.loginSubTitle = data;
        });
        this.translateService.get('LOGIN_ERROR_TITLE').subscribe((data) => {
            this.loginTitle = data;
        });
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
    }
}

