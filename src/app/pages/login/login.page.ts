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
    private teacher: Teacher;
    private student: Student;


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
            username: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])]
        });
        this.initTranslate();
    }

    onLogin() {
        console.log('ciaociao');
        const account: Account = this.loginFormModel.value;
        this.userService.login(account).subscribe((utente) => {
            if (this.userService.whichUserType() === 'teacher') {
                console.log('prof');
                this.teacher = new Teacher(utente);
                console.log('oggetto teacher');
                console.log(this.teacher);
                this.teacher$ = this.userService.getTeacher();
                console.log('Il bieviorSabject di teacher è:');
                console.log(this.teacher$.value);
                this.teacher = new Teacher(this.teacher$.value);
                console.log('teacher da beav');
                console.log(this.teacher);
            } else if (this.userService.whichUserType() === 'student') {
                console.log('stud');
                this.student = new Student(utente);
                console.log('oggetto student');
                console.log(this.student);
                this.student$ = this.userService.getStudent();
                console.log('Il bieviorSabject di student è:');
                console.log(this.student$.value);
                this.student = new Student(this.student$.value);
                console.log('student da beav');
                console.log(this.student);
            } else if (this.userService.whichUserType() === 'admin') {
                console.log('sono admin');
            }
            this.navController.navigateRoot('home');
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

