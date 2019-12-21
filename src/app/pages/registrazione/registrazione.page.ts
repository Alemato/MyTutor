import {Component, OnInit} from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    LoadingController,
    ModalController,
    NavController
} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {RegistrazioneService} from '../../services/registrazione.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegistrazioneDocenteModalPage} from '../registrazione-docente-modal/registrazione-docente-modal.page';
import {Crop} from '@ionic-native/crop/ngx';
import {Camera, CameraOptions} from '@ionic-native/Camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {Teacher} from '../../model/teacher.model';
import {User} from '../../model/user.model';
import {RegisterEmailValidator} from '../../validators/registerEmail.validator';
import {RegisterBirthdayValidator} from '../../validators/registerBirthday.validator';
import {Student} from '../../model/student.model';
import {RegistrationService} from '../../services/registration.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.page.html',
    styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {
    private registrazioneFormModel: FormGroup;
    registra = true;
    utente: User = new User();
    teacher: Teacher;
    student: Student = new Student();
    passwordType = 'password';
    passwordShow = false;
    public toogle = false;
    croppedImagepath = '';
    img = false;
    isLoading = false;
    private loading;
    private errorTitle: string;
    private errorSubTitle: string;

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
        private file: File
    ) {
    }

    imagePickerOptions = {
        maximumImagesCount: 1,
        quality: 50
    };

    validationMessages = {
        email: [
            {type: 'required', message: 'Username is required.'},
            {type: 'minlength', message: 'Username must be at least 5 characters long.'},
            {type: 'pattern', message: 'Your username must contain only numbers and letters.'},
            {type: 'validEmail', message: 'Your username has already been taken.'}
        ],
        password: [
            {type: 'required', message: 'Username is required.'}
        ],
        name: [
            {type: 'required', message: 'Username is required.'}
        ],
        surname: [
            {type: 'required', message: 'Username is required.'}
        ],
        birthday: [
            {type: 'required', message: 'Username is required.'},
            {type: 'validAge', message: 'validAge is required.'}
        ]
    };

// vuole tutti i campi perchè si deve aspettare qualcosa
    ngOnInit() {
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
            header: 'Select Image source',
            buttons: [{
                text: 'Load from Library',
                handler: () => {
                    this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.pickImage(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
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
                    alert('Error cropping image' + error);
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
            alert('Error in showing image' + error);
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
            message: 'Please wait...',
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
            header: this.errorTitle = 'Errore ' + status,
            message: this.errorSubTitle = message,
            buttons: ['OK']
        });

        await alert.present();
    }

    prendiRegistrazione() {
        console.log('registro utenza:');
        if (this.teacher == null || typeof this.teacher === 'undefined') {
            this.utente = this.registrazioneFormModel.value;
            this.utente.idUser = 0;
            this.utente.roles = 1;
            if (this.registrazioneFormModel.value.languageNumber === '0') {
                this.utente.language = false;
            } else {
                this.utente.language = true;
            }
            this.utente.image = this.croppedImagepath;
            this.student.set('', this.utente);
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
            this.utente.idUser = 0;
            this.utente.roles = 2;
            if (this.registrazioneFormModel.value.languageNumber === '0') {
                this.utente.language = false;
            } else {
                this.utente.language = true;
            }
            this.utente.image = this.croppedImagepath;
            this.teacher.set(this.teacher, this.utente);
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
        if (this.teacher == null || typeof this.teacher === 'undefined') {
            const modal = await this.modalController.create({
                component: RegistrazioneDocenteModalPage,
                componentProps: {
                    utente1
                }
            });
            modal.onDidDismiss().then((dataReturned) => {
                console.log('teache null o indeficnito i dati sono: ');
                console.log(dataReturned.data);
                this.teacher = new Teacher();
                this.teacher.set(dataReturned.data[0], dataReturned.data[0].user);
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
}
