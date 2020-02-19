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
import {RegisterBirthdayValidator} from '../../validators/registerBirthday.validator';
import {Student} from '../../model/student.model';
import {RegistrationService} from '../../services/registration.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {sha512} from 'js-sha512';

@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.page.html',
    styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {
    private registrazioneFormModel: FormGroup;
    private registra = true;
    private utente: User = new User();
    private teacher: Teacher = new Teacher();
    private student: Student = new Student();
    private passwordType = 'password';
    private passwordShow = false;
    private croppedImagepath = '';
    private img = false;
    private isLoading = false;
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

    validationMessages = {
        email: [
            {type: 'required', message: 'email is required.'},
            {type: 'minlength', message: 'email must be at least 5 characters long.'},
            {type: 'pattern', message: 'Your email is invalid'},
            {type: 'validEmail', message: 'Your email has already been taken.'}
        ],
        password: [
            {type: 'required', message: 'Password is required'},
            {type: 'minlength', message: 'Passowrd must be at least 5 characters long.'},
            {type: 'pattern', message: 'Your Passoword is invalid'}
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

    imagePickerOptions = {
        maximumImagesCount: 1,
        quality: 50
    };

    ngOnInit() {
        this.initTranslate();
        this.registrazioneFormModel = this.formBuilder.group({
            email: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(5),
                    // tslint:disable-next-line:max-line-length
                    Validators.pattern('(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')
                ])
            ],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{5,40}$')
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
            ])],
            language: ['true', Validators.required],
            toggle: [false, Validators.required]
        });
    }

    /**
     * Funzione che avvia l'iter dell'invio dei dati al server
     * triggerata dal bottone registrazione
     */
    prendiRegistrazione() {
        console.log('registro utenza:');
        // vedo se ho un oggetto teacher riempito
        if (Object.keys(this.teacher).length > 0) {
            this.inviaRegistrazioneTeacher(this.teacher);
        } else {
            // vedo se ho un oggetto student riempito e se non c'è lo creoo
            if (Object.keys(this.student).length > 0) {
                this.inviaRegistrazioneStudent(this.student);
            } else {
                this.createNewStudentFromForm();
                this.inviaRegistrazioneStudent(this.student);
            }
        }
    }

    /**
     * Funzione che invia i dati al server
     * @param teacher oggetto da inviare
     */
    inviaRegistrazioneTeacher(teacher: Teacher) {
        teacher.image = this.croppedImagepath;
        this.registrationService.registrationTeacher(teacher).subscribe(() => {
            this.navController.navigateRoot('/login');
        }, (err: HttpErrorResponse) => {
            if (err.status === 500) {
                console.error('login request error: ' + err.status + ' message:' + err.message);
                this.showLoginError(err.status, err.message);
            }
        });
    }

    /**
     * Funzione che invia i dati al server
     * @param student oggetto da inviare
     */
    inviaRegistrazioneStudent(student: Student) {
        student.image = this.croppedImagepath;
        this.registrationService.registrationStudent((student)).subscribe(() => {
            this.navController.navigateRoot('/login');
        }, (err: HttpErrorResponse) => {
            if (err.status === 500) {
                console.error('login request error: ' + err.status + ' message:' + err.message);
                this.showLoginError(err.status, err.message);
            }
        });
    }

    /**
     * Funzione che presenta il modale per registrare i dati del teacher
     */
    async openModal() {
        const modal = await this.modalController.create({
            component: RegistrazioneDocenteModalPage,
            componentProps: {teacher: this.teacher}
        });
        modal.onDidDismiss().then((data) => {
            console.log(data);
            if (data.data !== undefined) {
                this.teacher = data.data[0];
                this.registra = data.data[1];
            }
        });

        await modal.present();
    }

    /**
     * funzione che setta i dati del form nei oggetti giusti
     * Triggerata dal cambio stato del toogle
     */
    actionToggle() {
        console.log(this.registrazioneFormModel.value.toggle);
        if (this.registrazioneFormModel.value.toggle) {
            // ha cliccato ed è passato da "non teacher" a "teacher"
            // logiaca di creazione di un teacher
            this.utente = this.registrazioneFormModel.value;
            this.utente.idUser = 0;
            this.utente.roles = 2;
            this.utente.password = sha512(this.registrazioneFormModel.value.password).toUpperCase();
            this.utente.birthday = new Date(this.utente.birthday).getTime();
            this.utente.language = (this.registrazioneFormModel.value.language === 'true');
            this.student = new Student();
            this.teacher = new Teacher();
            this.teacher.setTeacherFromUser(this.utente);
            this.openModal();
        } else {
            // ha cambiato idea da "sono teacher" è passato a "non lo sono"
            // logica di creazione di un user
            this.createNewStudentFromForm();
            this.teacher = new Teacher();
        }
    }

    /**
     * Funzione che inizializza e setta un oggetto studente
     */
    createNewStudentFromForm() {
        this.student = new Student();
        this.utente = this.registrazioneFormModel.value;
        this.utente.idUser = 0;
        this.utente.roles = 1;
        this.utente.password = sha512(this.registrazioneFormModel.value.password).toUpperCase();
        this.utente.birthday = new Date(this.utente.birthday).getTime();
        this.utente.language = (this.registrazioneFormModel.value.language === 'true');
        this.student.setStudentFromUser(this.utente);
    }

    /**
     * Funzione che fa visualizzare la password
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
     * Funzione che attiva l'allert controller con i messaggi di errore REST
     * @param status status del errore
     * @param message messaggio di errore
     */
    async showLoginError(status: number, message: string) {
        const alert = await this.alertController.create({
            header: this.errorTitle = this.error + status,
            message: this.errorSubTitle = message,
            buttons: ['OK']
        });

        await alert.present();
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
            console.log(base64);
            this.isLoading = false;
            this.img = true;
        }, error => {
            alert(this.imageShowingError + error);
            this.isLoading = false;
        });
    }


    /**
     * Funzione per la traduzione
     */
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
