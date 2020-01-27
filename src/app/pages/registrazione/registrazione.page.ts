import {Component, OnInit} from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    LoadingController,
    ModalController,
    NavController
} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegistrazioneDocenteModalPage} from '../registrazione-docente-modal/registrazione-docente-modal.page';
import {Crop} from '@ionic-native/crop/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {Teacher} from '../../model/teacher.model';
import {User} from '../../model/user.model';
import {RegisterEmailValidator} from '../../validators/registerEmail.validator';
import {RegisterBirthdayValidator} from '../../validators/registerBirthday.validator';
import {Student} from '../../model/student.model';
import {RegistrationService} from '../../services/registration.service';
import {HttpErrorResponse} from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.page.html',
    styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {
    private registrazioneFormModel: FormGroup;
    registra = true;
    utente: User = new User(undefined);
    teacher: Teacher;
    student: Student = new Student(undefined);
    passwordType = 'password';
    passwordShow = false;
    public toogle = false;
    croppedImagepath = '';
    img = false;
    isLoading = false;
    private loading;
    private errorTitle: string;
    private errorSubTitle: string;
    private imageSourceHeader: string;
    private loadLibraryText: string;
    private useCameraText: string;
    private cancelButton: string;
    private imageCroppingError: string;
    private imageShowingError: string;
    private pleaseWaitMessage: string;
    private error: string;
    //
    private emailRequiredMessage: string;
    private emailMinLengthMessage: string;
    private emailPatternMessage: string;
    private emailValidEmailMessage: string;
    private passwordRequiredMessage: string;
    private nameRequiredMessage: string;
    private surnameRequiredMessage: string;
    private birthdayRequiredMessage: string;
    private birthdayValidAgeMessage: string;

    constructor(
        public formBuilder: FormBuilder,
        private storage: Storage,
        public modalController: ModalController,
        private camera: Camera,
        private crop: Crop,
        public actionSheetController: ActionSheetController,
        public loadingController: LoadingController,
        private registrationService: RegistrationService,
        private alertController: AlertController,
        private navController: NavController,
        private file: File,
        public translateService: TranslateService,
    ) {
    }

    imagePickerOptions = {
        maximumImagesCount: 1,
        quality: 50
    };

    validationMessages = {
        email: [
            {type: 'required', message: this.emailRequiredMessage},
            {type: 'minlength', message: this.emailMinLengthMessage},
            {type: 'pattern', message: this.emailPatternMessage},
            {type: 'validEmail', message: this.emailValidEmailMessage}
        ],
        password: [
            {type: 'required', message: this.passwordRequiredMessage}
        ],
        name: [
            {type: 'required', message: this.nameRequiredMessage}
        ],
        surname: [
            {type: 'required', message: this.surnameRequiredMessage}
        ],
        birthday: [
            {type: 'required', message: this.birthdayRequiredMessage},
            {type: 'validAge', message: this.birthdayValidAgeMessage}
        ]
    };

// vuole tutti i campi perchè si deve aspettare qualcosa
    ngOnInit() {
        this.initTranslate();
        this.registrazioneFormModel = this.formBuilder.group({
            // le cose che scrivo dentro [] le ritrovo sulla page registrazione.html
            email: ['', Validators.compose(
                [RegisterEmailValidator.emailIsValid,
                    Validators.required
                ])
            ],
            // roles: [''],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
            ])],
            name: ['', Validators.compose([
                Validators.required
            ])],
            surname: ['', Validators.compose([
                Validators.required
            ])],
            birthday: ['', Validators.compose([
                Validators.required,
                RegisterBirthdayValidator.isAdult
            ])],     // da verificare tipo
            languageNumber: ['true', Validators.required]
            // image: [''],
        });
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
        }, (err) => {
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
        const copyPath = ImagePath;
        const splitPath = copyPath.split('/');
        const imageName = splitPath[splitPath.length - 1];
        const filePath = ImagePath.split(imageName)[0];

        this.file.readAsDataURL(filePath, imageName).then(base64 => {
            this.croppedImagepath = base64;
            console.log(base64);
            this.isLoading = false;
            this.img = true;
        }, error => {
            alert(this.imageShowingError + error);
            this.isLoading = false;
        });
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

    async showLoginError(status: number, message: string) {
        this.Diss();
        const alert = await this.alertController.create({
            header: this.errorTitle = this.error + status,
            message: this.errorSubTitle = message,
            buttons: ['OK']
        });

        await alert.present();
    }

    prendiRegistrazione() {
        console.log('registro utenza:');
        if (this.teacher == null || typeof this.teacher === 'undefined') {
            console.log('utenza di tipo student');
            this.utente = this.registrazioneFormModel.value;
            this.utente.idUser = 0;
            this.utente.roles = 1;
            this.utente.birthday = new Date(this.utente.birthday).getTime();
            if (this.registrazioneFormModel.value.languageNumber === '0') {
                this.utente.language = false;
            } else {
                this.utente.language = true;
            }
            this.utente.image = this.croppedImagepath;
            this.student.set(this.utente);
            this.Loading();
            this.registrationService.registrationStudent(this.student).subscribe((data) => {
                    this.Diss();
                    this.registrazioneFormModel.reset();
                    this.navController.navigateRoot('login');
                },
                (err: HttpErrorResponse) => {
                    if (err.status === 500) {
                        console.error('login request error: ' + err.status);
                        this.showLoginError(err.status, err.message);
                    }
                });
            console.log(this.student);
            console.log(JSON.stringify(this.student));
        } else {
            console.log('utenza di tipo docente');
            this.teacher.idUser = 0;
            this.teacher.roles = 2;
            this.teacher.birthday = new Date(this.utente.birthday).getTime();
            if (this.registrazioneFormModel.value.languageNumber === '0') {
                this.teacher.language = false;
            } else {
                this.teacher.language = true;
            }
            this.teacher.image = this.croppedImagepath;
            this.Loading();
            this.registrationService.registrationTeacher(this.teacher).subscribe((data) => {
                    this.Diss();
                    this.registrazioneFormModel.reset();
                    this.navController.navigateRoot('login');
                },
                (err: HttpErrorResponse) => {
                    if (err.status === 500) {
                        console.error('login request error: ' + err.status + ' message:' + err.message);
                        this.showLoginError(err.status, err.message);
                    }
                });
            console.log(this.teacher);
            console.log(JSON.stringify(this.teacher));
        }
    }

    async openModal() {
        this.utente = this.registrazioneFormModel.value;
        this.registra = false;
        const teacher1: Teacher = this.teacher;
        const utente1: User = this.utente;
        if (this.teacher == null || typeof this.teacher === undefined) {
            const modal = await this.modalController.create({
                component: RegistrazioneDocenteModalPage,
                componentProps: {
                    utente1
                }
            });
            modal.onDidDismiss().then((dataReturned) => {
                console.log('teache null o indeficnito i dati sono: ');
                console.log(dataReturned.data);
                this.teacher = new Teacher(undefined);
                this.teacher.set(dataReturned.data[0]);
                this.registra = dataReturned.data[1];
            });

            await modal.present();

        } else {
            this.registra = false;
            const modal = await this.modalController.create({
                component: RegistrazioneDocenteModalPage,
                componentProps: {
                    utente1,
                    teacher1
                }
            });
            modal.onDidDismiss().then((dataReturned) => {
                console.log('i dati sono: ');
                console.log(dataReturned.data);
                this.teacher = dataReturned.data[0];
                this.registra = dataReturned.data[1];
            });

            await modal.present();
        }
    }

    notify() {
        if (this.toogle) {
            this.toogle = false;
            this.teacher = null;
            this.utente.roles = 1;
            console.log(this.toogle);
        } else {
            this.toogle = true;
            this.utente = this.registrazioneFormModel.value;
            console.log('sto con il true, teacher');
            console.log(this.utente);
            this.utente.roles = 2;
            this.openModal();
        }
    }

    onSubmit(bob: any) {
        console.log(bob);
    }

    notifyCondition() {
        if (this.toogle) {
            this.openModal();
        } else {
            // caso in cui l'utente non ha mai aperto il model e non esiste l'utenza
            this.utente = this.registrazioneFormModel.value;
            this.utente.roles = 1;
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
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
        this.translateService.get('ERROR').subscribe((data) => {
            this.error = data;
        });
        //
        this.translateService.get('EMAIL_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.email[0].message = data;
        });
        this.translateService.get('EMAIL_MIN_LENGTH_MESSAGE').subscribe((data) => {
            this.emailMinLengthMessage = data;
        });
        this.translateService.get('EMAIL_PATTERN_MESSAGE').subscribe((data) => {
            this.emailPatternMessage = data;
        });
        this.translateService.get('EMAIL_VALID_EMAIL_MESSAGE').subscribe((data) => {
            this.emailValidEmailMessage = data;
        });
        this.translateService.get('PASSWORD_REQUIRED_MESSAGE').subscribe((data) => {
            this.passwordRequiredMessage = data;
        });
        this.translateService.get('NAME_REQUIRED_MESSAGE').subscribe((data) => {
            this.nameRequiredMessage = data;
        });
        this.translateService.get('SURNAME_REQUIRED_MESSAGE').subscribe((data) => {
            this.surnameRequiredMessage = data;
        });
        this.translateService.get('BIRTHDAY_REQUIRED_MESSAGE').subscribe((data) => {
            this.birthdayRequiredMessage = data;
        });
        this.translateService.get('BIRTHDAY_VALID_AGE_MESSAGE').subscribe((data) => {
            this.birthdayValidAgeMessage = data;
        });
    }
}
