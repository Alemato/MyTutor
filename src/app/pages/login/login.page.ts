import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, Events, MenuController, NavController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
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
    private teacher: Teacher;
    private student: Student;


    constructor(private formBuilder: FormBuilder,
                private alertController: AlertController,
                private translateService: TranslateService,
                private navController: NavController,
                private userService: UserService,
                public events: Events,
                public menuCtrl: MenuController) {
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
            username: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])]
        });
        this.initTranslate();
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(false);
    }
    ionViewDidLeave() {
        this.menuCtrl.enable(true);
        this.events.publish('leaveLogin', true);
    }
    onLogin() {
        console.log('ciaociao');
        const account: Account = this.loginFormModel.value;
        this.userService.login(account).subscribe((utente) => {
            if (this.userService.whichUserType() === 'teacher') {
                this.teacher = new Teacher(utente);
                this.teacher$ = this.userService.getTeacher();
            } else if (this.userService.whichUserType() === 'student') {
                console.log('stud');
                this.student = new Student(utente);
                this.student$ = this.userService.getStudent();
            } else if (this.userService.whichUserType() === 'admin') {
                console.log('sono admin');
            }
            this.loginFormModel.reset();
            this.navController.navigateRoot('home');
        },
            (err: HttpErrorResponse) => {
                if (err.status === 401) {
                    console.error('login request error: ' + err.status);
                    this.showLoginError();
                }
                if (err.status === 500) {
                    console.error('login request error: ' + err.status);
                    this.showLoginError();
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
        this.translateService.get('LOGIN_ERROR_SUB_TITLE').subscribe((data) => {
            this.loginSubTitle = data;
        });
        this.translateService.get('LOGIN_ERROR_TITLE').subscribe((data) => {
            this.loginTitle = data;
        });
    }
}

