import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActionSheetController, AlertController, NavController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {UserService} from '../../services/user.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {Crop} from '@ionic-native/crop/ngx';
import {RegisterBirthdayValidator} from '../../validators/registerBirthday.validator';
import {SuperTabs} from '@ionic-super-tabs/angular';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'modifica-profilo',
    templateUrl: './modifica-profilo.page.html',
    styleUrls: ['./modifica-profilo.page.scss'],
})
export class ModificaProfiloPage implements OnInit {
    private student$: BehaviorSubject<Student>;
    // private student: Student = new Student(undefined);
    private teacher$: BehaviorSubject<Teacher>;
    // private teacher: Teacher = new Teacher(undefined);
    private type = 0;
    private userType: string;
    private teacherFormModel: FormGroup;
    private studentFormModel: FormGroup;
    public passwordType = 'password';
    public passwordShow = false;
    public toogle = false;
    croppedImagepath = '';
    img = false;
    isLoading = false;
    private errorTitle: string;
    private errorSubTitle: string;
    private imageSourceHeader: string;
    private loadLibraryText: string;
    private useCameraText: string;
    private cancelButton: string;
    private imageCroppingError: string;
    private imageShowingError: string;

    imagePickerOptions = {
        maximumImagesCount: 1,
        quality: 50
    };

    validationMessages = {
        email: [
            {type: 'required', message: 'email is required.'},
            {type: 'minlength', message: 'email must be at least 5 characters long.'},
            {type: 'pattern', message: 'Your email is invalid'},
            {type: 'validEmail', message: 'Your email has already been taken.'}
        ],
        password: [
            {type: 'required', message: 'Password is required'}
        ],
        name: [
            {type: 'required', message: 'Name is required'}
        ],
        surname: [
            {type: 'required', message: 'Surname is required'}
        ],
        birthday: [
            {type: 'required', message: 'birthday is required'},
            {type: 'validAge', message: 'You must be 18 years old'}
        ]
    };

    constructor(
        private storage: Storage,
        public formBuilder: FormBuilder,
        private userService: UserService,
        private camera: Camera,
        private crop: Crop,
        public actionSheetController: ActionSheetController,
        private file: File,
        private navController: NavController,
        private superTab: SuperTabs,
        private alertController: AlertController,
        public translateService: TranslateService,
    ) {
    }

    ngOnInit() {
        this.initTranslate();
        this.userType = this.userService.getTypeUser();
        if (this.userType === 'student') {
            this.student$ = this.userService.getUser();
            this.type = 1;
            this.studentFormModel = this.formBuilder.group({
                // le cose che scrivo dentro [] le ritrovo sulla page registrazione.html
                name: ['', Validators.required],
                surname: ['', Validators.required],
                password2: [''],
                password: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(5),
                    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])
                ],
                birthday: ['', Validators.compose([
                    Validators.required,
                    RegisterBirthdayValidator.isAdult
                ])],
                studyGrade: [''],
                languageNumber: ['0', Validators.required]
            });
            this.setValori();
        } else if (this.userType === 'teacher') {
            this.teacher$ = this.userService.getUser();

            this.type = 2;
            this.teacherFormModel = this.formBuilder.group({
                // le cose che scrivo dentro [] le ritrovo sulla page registrazione.html
                name: ['', Validators.required],
                surname: ['', Validators.required],
                password2: [''],
                password: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(5),
                    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
                ])],
                birthday: ['', Validators.compose([
                    Validators.required,
                    RegisterBirthdayValidator.isAdult
                ])],
                region: ['', Validators.required],
                city: ['', Validators.required],
                postCode: ['', Validators.required],
                street: ['', Validators.required],
                streetNumber: ['', Validators.required],
                byography: ['', Validators.required],
                languageNumber: ['0', Validators.required]
            });
            this.setValori();
        }
    }

    setValori() {/*
        if (this.type === 1) {
            this.student$.subscribe(data => {
                this.student.set(data);
                const obj = {
                    name: this.student.name,
                    surname: this.student.surname,
                    password: null,
                    password2: '',
                    birthday: new Date(this.student.birthday).toISOString(),
                    studyGrade: this.student.studyGrade,
                    languageNumber: this.student.numberRules().toString()
                };
                this.studentFormModel.setValue(obj);
                this.studentFormModel.controls.password.clearValidators();
            });
        } else if (this.type === 2) {
            this.teacher$.subscribe(teacher => {
                this.teacher.set(teacher);
                const obj = {
                    name: this.teacher.name,
                    surname: this.teacher.surname,
                    password: null,
                    password2: '',
                    birthday: new Date(this.teacher.birthday).toISOString(),
                    region: this.teacher.region,
                    city: this.teacher.city,
                    postCode: this.teacher.postCode,
                    street: this.teacher.street,
                    streetNumber: this.teacher.streetNumber,
                    byography: this.teacher.byography,
                    languageNumber: this.teacher.numberRules().toString()
                };
                this.teacherFormModel.setValue(obj);
                this.teacherFormModel.controls.password.clearValidators();
            });
        }*/
    }

    public setPwdValidator() {
        if (this.type === 1) {
            this.studentFormModel.controls.password.setValidators(Validators.compose([
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])
            );
        } else if (this.type === 2) {
            this.teacherFormModel.controls.password.setValidators(Validators.compose([
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])
            );
        }
    }

    // PER IMAGINI DALLA FOTOCAMERA O GALLERIA
    pickImage(sourceType) {
        const options: CameraOptions = {
            quality: 100,
            sourceType,
            correctOrientation: true,
            saveToPhotoAlbum: true,
            targetWidth: 720,
            targetHeight: 720,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            // let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.cropImage(imageData);
        }, () => {
            // Handle error
        });
    }

    async selectImage() {
        const actionSheet = await this.actionSheetController.create({
            header: this.imageSourceHeader,
            buttons: [{
                text: this.loadLibraryText,
                handler: () => {
                    this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
                {
                    text: this.useCameraText,
                    handler: () => {
                        this.pickImage(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: this.cancelButton,
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    cropImage(fileUrl) {
        this.crop.crop(fileUrl, {quality: 100, targetWidth: -1, targetHeight: -1})
            .then(
                newPath => {
                    this.showCroppedImage(newPath.split('?')[0]);
                },
                error => {
                    alert(this.imageCroppingError + error);
                }
            );
    }

    showCroppedImage(ImagePath) {
        this.isLoading = true;
        const splitPath = ImagePath.split('/');
        const imageName = splitPath[splitPath.length - 1];
        const filePath = ImagePath.split(imageName)[0];
        this.file.readAsDataURL(filePath, imageName).then(base64 => {
            this.croppedImagepath = base64;
            this.isLoading = false;
            this.img = true;
        }, error => {
            alert(this.imageShowingError + error);
            this.isLoading = false;
        });
    }

    async salvaModifica() {
       /* if (this.type === 1) {
            this.student.set(this.studentFormModel.value);
            this.student.birthday = new Date(this.student.birthday).getTime();
            if (this.img) {
                this.student.image = this.croppedImagepath;
            }
            if (this.studentFormModel.controls.password.value) {
                this.userService.editProfiloStudent(this.student, this.studentFormModel.controls.password2.value).subscribe(() => {
                    this.userService.logout();
                    this.navController.navigateRoot('login');
                }, (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.errorTitle = err.status + ' ' + err.statusText;
                        this.errorSubTitle = err.error.message;
                        this.showLoginError();
                        this.teacherFormModel.controls.password2.reset();
                    }
                });
            } else {
                this.student.password = this.studentFormModel.controls.password2.value;
                this.userService.editProfiloStudent(this.student, this.studentFormModel.controls.password2.value).subscribe(() => {
                    this.userService.getProfilobyID(this.student.idUser).subscribe(() => {
                        this.superTab.selectTab(0);
                    });
                }, (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.errorTitle = err.status + ' ' + err.statusText;
                        this.errorSubTitle = err.error.message;
                        this.showLoginError();
                        this.teacherFormModel.controls.password2.reset();
                    }
                });
            }
        } else if (this.type === 2) {
            this.teacher.set(this.teacherFormModel.value);
            this.teacher.birthday = new Date(this.teacher.birthday).getTime();
            if (this.img) {
                this.teacher.image = this.croppedImagepath;
            }
            if (this.teacherFormModel.controls.password.value) {
                this.userService.editProfiloTeacher(this.teacher, this.teacherFormModel.controls.password2.value).subscribe(() => {
                    this.userService.logout();
                    this.navController.navigateRoot('login');
                }, (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.errorTitle = err.status + ' ' + err.statusText;
                        this.errorSubTitle = err.error.message;
                        this.showLoginError();
                        this.teacherFormModel.controls.password2.reset();
                    }
                });
            } else {
                this.teacher.password = this.teacherFormModel.controls.password2.value;
                this.userService.editProfiloTeacher(this.teacher, this.teacherFormModel.controls.password2.value).subscribe(() => {
                    this.userService.getProfilobyID(this.student.idUser).subscribe(() => {
                        this.superTab.selectTab(0);
                    });
                }, (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.errorTitle = err.status + ' ' + err.statusText;
                        this.errorSubTitle = err.error.message;
                        this.showLoginError();
                        this.teacherFormModel.controls.password2.reset();
                    }
                });
            }
        }*/
    }

    async showLoginError() {
        const alert = await this.alertController.create({
            header: this.errorTitle,
            message: this.errorSubTitle,
            buttons: ['OK']
        });

        await alert.present();
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
    private initTranslate() {
        this.translateService.get('IMAGE_SOURCE_HEADER').subscribe((data) => {
            this.imageSourceHeader = data;
        });
        this.translateService.get('LOAD_LIBRARY_TEXT').subscribe((data) => {
            this.loadLibraryText = data;
        });
        this.translateService.get('USE_CAMERA_TEXT').subscribe((data) => {
            this.useCameraText = data;
        });
        this.translateService.get('CANCEL_BUTTON').subscribe((data) => {
            this.cancelButton = data;
        });
        this.translateService.get('IMAGE_CROPPING_ERROR').subscribe((data) => {
            this.imageCroppingError = data;
        });
        this.translateService.get('IMAGE_SHOWING_ERROR').subscribe((data) => {
            this.imageShowingError = data;
        });
        //
        this.translateService.get('EMAIL_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.email[0].message = data;
        });
        this.translateService.get('EMAIL_MIN_LENGTH_MESSAGE').subscribe((data) => {
            this.validationMessages.email[1].message = data;
        });
        this.translateService.get('EMAIL_PATTERN_MESSAGE').subscribe((data) => {
            this.validationMessages.email[2].message = data;
        });
        this.translateService.get('EMAIL_VALID_EMAIL_MESSAGE').subscribe((data) => {
            this.validationMessages.email[3].message = data;
        });
        this.translateService.get('PASSWORD_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.password[0].message = data;
        });
        this.translateService.get('NAME_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.name[0].message = data;
        });
        this.translateService.get('SURNAME_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.surname[0].message = data;
        });
        this.translateService.get('BIRTHDAY_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.birthday[0].message = data;
        });
        this.translateService.get('BIRTHDAY_VALID_AGE_MESSAGE').subscribe((data) => {
            this.validationMessages.birthday[1].message = data;
        });
    }
}
