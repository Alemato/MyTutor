import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, NavController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../../model/user.model';
import {Account, UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';

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
    private student$: BehaviorSubject<Student>;
    private teacher$: BehaviorSubject<Teacher>;
    private typeUser$: BehaviorSubject<string>;

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
        this.userService.login(account).subscribe((prova) => {
            console.log('il body è:');
            console.log(prova);
            console.log('Il bieviorSabject è:');
            // if (this.typeUser$.) {}
            if (prova.idTeacher) {
                console.log('prof');
                this.teacher$ = this.userService.getTeacher();
                console.log(this.teacher$.value.user.email);
            } else if (prova.idStudent) {
                console.log('stud');
                this.student$ = this.userService.getStudent();
                console.log(this.student$.value.user.email);
            } else {
                console.log('sono admin');
            }
        });
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

