import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, NavController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../../model/user.model';
import {Account, UserService} from '../../services/user.service';

@Component({
    selector: 'page-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    private loginFormModel: FormGroup;
    private loginTitle: string;
    private loginSubTitle: string;
    passwordType = 'password';
    passwordShow = false;

    constructor(private formBuilder: FormBuilder,
                private alertController: AlertController,
                private translateService: TranslateService,
                private navController: NavController,
                private userService: UserService) {
    }

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
        this.loginFormModel = this.formBuilder.group({
            username: [],
            password: []
        });
        this.initTranslate();
    }

    onLogin() {
        console.log('ciaociao');
        const account: Account = this.loginFormModel.value;
        this.userService.login(account);
    }

    async showLoginError() {
        const alert = await this.alertController.create({
            header: this.loginTitle,
            message: this.loginSubTitle,
            buttons: ['OK']
        });

        await alert.present();
    }

    private initTranslate() {
    }
}

